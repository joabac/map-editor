/* Copyright (c) 2006 MetaCarta, Inc., published under a modified BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/repository-license.txt 
 * for the full text of the license. */


/**
 * @requires OpenLayers/Control/DragFeature.js
 * @requires OpenLayers/Control/SelectFeature.js
 * @requires OpenLayers/Handler/Keyboard.js
 * 
 * Class: OpenLayers.Control.ModifyFeature
 * Control to modify features.  When activated, a click renders the vertices
 *     of a feature - these vertices can then be dragged.  By default, the
 *     delete key will delete the vertex under the mouse.  New features are
 *     added by dragging "virtual vertices" between vertices.  Create a new
 *     control with the <OpenLayers.Control.ModifyFeature> constructor.
 *
 * Inherits From:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.UndoRedo = OpenLayers.Class(OpenLayers.Control, {
    
     /**
     * Property: keyboardHandler
     * {<OpenLayers.Handler.Keyboard>}
     */
    keyboardHandler: null,
    
    // FIXME: Should be moved to lib/OpenLayers/Events.js, like other important key events.
    /** 
     * Constant: KEY_CTRL 
     * {int} 
     */
    KEY_CTRL: 17,
    
    /** 
     * Constant: KEY_SHIFT
     * {int} 
     */
    KEY_SHIFT: 16,
    
    /** 
     * Constant: KEY_Z 
     * {int} 
     */
    KEY_Z: 90,
    
    /** 
     * Constant: KEY_Y
     * {int} 
     */
    KEY_Y: 89,
    
	onUndo: function(){},
	onRedo: function(){},	
	
    keydownStack: null,
	
	ACTION_UNDO: true,
	ACTION_REDO: false,
	
	/**
     * Property: undoOrderStack
     * {<Array>}
     * 
     * A stack containing the order in which features should be undone. When registering an addition or modification for
     * a given feature, that feature set as "next" on the undo list (the top of the stack). 
     */
    undoOrderStack: null, 
    featureRedoStack: null, 
    undoStacks: null,
	redoStacks: null,
    
    /**
     * Constructor: OpenLayers.Control.UndoRedo
     * Create a new Undo/Redo control.
     *
     * Parameters:
     * layer - {<OpenLayers.Layer.Vector>} Layer that contains features that
     *     will be modified.
     * options - {Object} Optional object whose properties will be set on the
     *     control.
     */
    initialize: function(layer, options) {
        
        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        
        // Configure the keyboard handler
        var keyboardOptions = {
            keydown: this.handleKeydown,
            keyup:   this.handleKeyup
        };
        this.keyboardHandler = new OpenLayers.Handler.Keyboard(
            this, keyboardOptions
        );
        
        this.keydownStack = new Array();
        this.undoOrderStack = new Array();  
        this.featureRedoStack = new Array();   
        this.undoStacks = {};
		this.redoStacks = {};
    },
    
    /**
     * APIMethod: activate
     * Activate the control and the feature handler.
     * 
     * Returns:
     * {Boolean} Successfully activated the control and feature handler.
     */
    activate: function() {
        return (this.keyboardHandler.activate() 
            && OpenLayers.Control.prototype.activate.apply(this, arguments));
    },

    /**
     * APIMethod: deactivate
     * Deactivate the controls.
     *
     * Returns: 
     * {Boolean} Successfully deactivated the control.
     */
    deactivate: function() {
        var deactivated = false;
        // The return from the controls is unimportant in this case.
        if(OpenLayers.Control.prototype.deactivate.apply(this, arguments)) {
            this.keyboardHandler.deactivate();
            deactivated = true;
        }
        return deactivated;
    },

    /**
     * Method: draw
     * Create handler.
     */
    draw: function() {
        this.activate();
    },
    
    /**
     * Method: handleKeydown
     * Called by the feature handler on keydown.
     *
     * Parameters:
     * {Integer} Key code corresponding to the keypress event.
     */
    handleKeydown: function(code) {
//        this.keydownStack.push(code)
        
        if (this.isValidUndo(code))
        {
            var currentlyOnMap = null;
            do 
            {
                    if (this.undoOrderStack.length == 0) 
                    {
                            console.log("Nothing on the stack.");
                            return;
                    }
                    currentlyOnMap = this.undoOrderStack.pop();
                    
            } while (this.getUndoStack(currentlyOnMap).length == 0);

            //this.onUndo(currentlyOnMap);

            console.log("Undoing: " + currentlyOnMap.id);
			 
            var nextGeometry = null; 
            var undoStack = this.getUndoStack(currentlyOnMap);
            
            do {
                nextGeometry = undoStack.pop();
                console.log("Popped a geometry.");
                
                if (nextGeometry == null) break;
                
            } while (currentlyOnMap.geometry.equals(nextGeometry))
                
			
            currentlyOnMap.layer.removeFeatures(currentlyOnMap);
            
            if (nextGeometry != null)
            {				
                    currentlyOnMap.geometry = nextGeometry;
                    editingLayer.drawFeature(currentlyOnMap);
            }
			
			
        }
//        else if (this.isValidRedo(this.keydownStack))
//        {
//        	this.map.pan(-75, 0);
//			//this.onRedo(feature);
//        }
    },
    
    /**
     * Method: handleKeyup
     * Called by the feature handler on keyup.
     *
     * Parameters:
     * {Integer} Key code corresponding to the keypress event.
     */
    handleKeyup: function(code) {
        codeindex = OpenLayers.Util.indexOf(this.keydownStack, code);
        this.keydownStack.splice(codeindex, 1);
    },
    
    isValidUndo: function(stack) {
        return this.compareArrays(stack, [this.KEY_CTRL, this.KEY_Z])
    },
    
    isValidRedo: function(stack) {
        return this.compareArrays(stack, [this.KEY_CTRL, this.KEY_Y])
            || this.compareArrays(stack, [this.KEY_CTRL, this.KEY_SHIFT, this.KEY_Z])
    },
    
	// FIXME: Should probably be moved to OpenLayers.Util.
    compareArrays: function(array1, array2) {
        
        if (array1.length != array2.length) return false;
        
        for (var i = 0; i < array2.length; i++) {
            if (array1[i] !== array2[i]) return false;
        }
        return true;
    },
    
	/*
	 * Register Functions. Used for telling the Undo/Redo control that an undoable change has been made.
	 */
	/**
     * Method: registerModification
     * Tells the Undo/Redo control that an undoable change has been made to an already-existing feature.
     * This should not be called when I feature is added; see registerAddition.
     *
     * Parameters:
     * {<OpenLayers.Feature.Vector>} Feature that has been changed.
     */
    registerModification: function(feature) {
        this.register(feature, feature.geometry.clone());
    },
	
    undo: function()
    {
        this.handleKeydown([this.KEY_CTRL,this.KEY_Z]);
        
    },
     redo: function()
    {
        this.handleKeydown([this.KEY_CTRL, this.KEY_SHIFT, this.KEY_Z]);
        
    },
	/**
     * Method: registerAddition
     * Tells the Undo/Redo control that a new feature has just been created, and that this creation should be undoable.
     *
     * Parameters:
     * {<OpenLayers.Feature.Vector>} Feature that has been added.
     */
	registerAddition: function(feature) {
		this.register(feature, null);
	},
    
	/**
     * Method: register
     * Generic function called by registerModification and registerAddition. Does the actual registration work.
     * 
     * Parameters:
     * {<OpenLayers.Feature.Vector>} Feature that is being registered.
     * {<OpenLayers.Geometry>} Geometry object corresponding to the current change or addition. If null, this registration is
     * interpreted as either an addition or deletion.
     */
    register: function(feature, value) {
		// Make this feature next in the "global" undo stack.
        this.undoOrderStack.push(feature);
        this.getUndoStack(feature).push(value);
		console.log("Pushing: " + feature.id + "; " + this.getUndoStack(feature).length);
    },
    
	/*
	 * Individual Stack functions. Used for getting the undo and redo stacks associated with a given feature.
	 * There's little added indirection here, but it's all in the spirit of reducing duplicated code.
	 */
	/**
     * Method: getUndoStack
     * Get the undo stack for a given feature.
     * 
     * Parameters:
     * {<OpenLayers.Feature.Vector>} Feature that is being registered.
     * {<OpenLayers.Geometry>} Geometry object corresponding to the current change or addition. If null, this registration is
     * interpreted as either an addition or deletion.
     */
    getUndoStack: function(feature) {
        return this.getStack(feature, this.undoStacks);
    },
	
	getRedoStack: function(feature) {
		return this.getStack(feature, this.redoStacks);
	},
	
	getStack: function(feature, stackHash) {
		 if (stackHash[feature.id] == null) stackHash[feature.id] = [];
         return stackHash[feature.id];
	},
    
    CLASS_NAME: "OpenLayers.Control.UndoRedo"
});