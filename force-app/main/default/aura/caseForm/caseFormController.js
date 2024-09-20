({
    doInit: function(component, event, helper){        
        let pageReference = component.get("v.pageReference");

        // Se o recordTypeId não está na URL (usuário com apenas 1 Record Type)
        if (!pageReference || !pageReference.state.recordTypeId) {
            console.log('Entrei 1')
            // Chamamos o helper para carregar o Record Type Id usando a API
            component.loadRecordTypeId(component);
        } else {
            console.log('Entrei 2')
            // Se o recordTypeId estiver na URL, definimos no componente
            component.set("v.recordTypeId", pageReference.state.recordTypeId);
            component.getRecordTypeName(component);
        }
    },
    
    handleLwcSubmit : function(component, event, helper) {        
        // Encontra o LWC pelo aura:id
        const lwcComponent = component.find("lwcCaseFormLayout");
    
        // Dispara o evento 'submitform' no LWC
        const lwcElement = lwcComponent.getElement();
        const submitEvent = new CustomEvent('submitform', {
            bubbles: true, // Permite que o evento suba na hierarquia DOM
            composed: true // Permite que o evento ultrapasse as sombras do LWC
        });

        lwcElement.dispatchEvent(submitEvent);
    },

    closeModal: function(component, event, helper) {
        // Close modal by setting the boolean attribute to false
        component.set("v.isOpen", false);
        const cmp = component.find('lwcCaseFormLayout');
        cmp.handleClose(event);   
    },

    loadRecordTypeId: function(component) {

        // Use o Adaptador UI para buscar informações sobre o objeto
        var action = component.get("c.getSingleRecordTypeForUser");
        
        /*
        action.setParams({
            objectApiName: "Case" // Substitua por seu objeto
        }); */

        action.setCallback(this, function(response) {
            let state = response.getState();
           
            if (state === "SUCCESS") {
                let recordTypeId = response.getReturnValue();              
                
                console.info("recordTypeId", recordTypeId);

                // Defina o Record Type Id no componente
                if (recordTypeId) {
                    component.set("v.recordTypeId", recordTypeId);
                    component.getRecordTypeName(component);
                }
            } else {
                console.error("Erro ao buscar informações do objeto.");
            }
        });

        $A.enqueueAction(action);
    },        
    getRecordTypeName: function(component) {
        console.log('ENtrei getRecordTypeName');
        let recordTypeId = component.get("v.recordTypeId");

        var action = component.get("c.getRecordTypeNameById");
        action.setParams({
            recordTypeId: recordTypeId
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var recordTypeName = response.getReturnValue();
                component.set("v.recordTypeName", recordTypeName);
                console.log('Helper recordTypeName', recordTypeName);
                component.newCase(component);
            } else {
                console.error("Failed to retrieve Record Type Name.");
            }
        });

        $A.enqueueAction(action);
        
    },

    newCase: function(component){
        // para o LWC
        let recordTypeName = component.get("v.recordTypeName");
        if(recordTypeName === 'CAC'){
            let createRecordEvent = $A.get("e.force:createRecord");
            createRecordEvent.setParams({
                "entityApiName": "Case",
                "panelOnCreate": true    // Mostra a tela de criação de registro
            });
            createRecordEvent.fire();
            this.closeModal();
        }
        else{
            component.set("v.isOpen", true); 
        }
    }

})
