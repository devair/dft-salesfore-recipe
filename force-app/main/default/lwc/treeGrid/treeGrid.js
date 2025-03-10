import { LightningElement,api } from 'lwc';

export default class TreeGrid extends LightningElement {
    @api columns;
    @api records;  
    @api columnsChildren;

    expandedItems = [ ];
    
    handleItemClick(event) {
        const recordId = parseInt(event.currentTarget.dataset.id, 10);

        // Criar uma cópia mutável do array
        const updatedRecords = [...this.records];

        // Encontrar o item específico
        const recordIndex = updatedRecords.findIndex(record => record.id === recordId);

        const record = updatedRecords.find(record => record.id === recordId);


        if (recordIndex !== -1) {
            const isExpanded = record.icon === 'utility:chevrondown';
            const updatedRecord = { 
                ...updatedRecords[recordIndex], 
                icon: isExpanded ? 'utility:chevronright': 'utility:chevrondown',
                isExpanded: !isExpanded
            };
            
            // Substituir o objeto modificado no array
            updatedRecords[recordIndex] = updatedRecord;

            // Atualizar a referência da propriedade para disparar a reatividade
            this.records = updatedRecords;
            
            if (!isExpanded) {
                this.expandedItems = [ ... this.expandedItems, record.id];
            }                
            else {
                // Remove do array se estiver colapsando
                this.expandedItems = this.expandedItems.filter(id => id !== record.id);
            }                       
        }

        console.info(JSON.stringify(this.expandedItems));
    }
}