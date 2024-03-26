({
    closeModal: function(component, event, helper) {
        // Close modal by setting the boolean attribute to false
        component.set("v.isOpen", false);
        const cmp = component.find('lwcRecordEditForm');
        cmp.handleClose(event);   
    },

    handleLwcSubmit : function(component, event, helper) {        
        const cmp = component.find('lwcRecordEditForm');
        cmp.handleSubmit(event);   
    },

})