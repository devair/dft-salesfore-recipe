import { LightningElement, api, track } from 'lwc';
import { findRecord } from './dataGridHelper';
import { processRecords } from './dataGridHelper';

export default class DataGrid extends LightningElement {
    @api mainRecords;
        
    @track processedMainRecords;
    expandedItems = [];

    @track showNoData = true;

    connectedCallback() {                
        
        this.refreshData(false);
    }

    @api refreshData(expanded){        

        if(this.mainRecords && this.mainRecords.data && this.mainRecords.data.length > 0){
            this.showNoData = false;
            this.processedMainRecords = undefined;
            this.processedMainRecords = processRecords(this.mainRecords.data, this.mainRecords.columns, expanded);  
        }
        else{
            this.showNoData = true;
        }
    }
    
    handleExpand(event, level) {
        const recordId = event.currentTarget.dataset.id;       

        // Encontra o registro correspondente
        const record = findRecord(this.processedMainRecords.data, recordId);

        if (record) {
            this.changeElement(record);
        }
    }

    handleExpandLevelOne(event) {
        this.handleExpand(event, 1);
    }

    handleExpandLevelTwo(event) {
        this.handleExpand(event, 2);
    }

    handleExpandLevelThree(event) {
        this.handleExpand(event, 3);
    }

    changeElement(elem) {
        // Alterna o estado de expansão e o ícone
        const isExpanded = elem.icon === 'utility:chevrondown';
        elem.icon = isExpanded ? 'utility:chevronright' : 'utility:chevrondown';
        elem.isExpanded = !isExpanded;

        // Atualiza a lista de itens expandidos
        if (!isExpanded) {
            this.expandedItems = [...this.expandedItems, elem.id];
        } else {
            this.expandedItems = this.expandedItems.filter(id => id !== elem.id);
        }

        return elem;
    }

    handleRowClick(event) {

        if (event.target.tagName === 'BUTTON' || event.target.tagName === 'A') {
            return;
        }
        const recordId = event.currentTarget.dataset.id;    
        const record = findRecord(this.processedMainRecords.data, recordId);    
        if (record) {
            // Disparar evento com o objeto da linha clicada
            const rowClickEvent = new CustomEvent('rowclick', {
                detail: { record }
            });
    
            this.dispatchEvent(rowClickEvent);
        }

        console.debug('handleRowClick', JSON.stringify(record));
    }
    
    handleActionClick(event) {
        event.stopPropagation(); // Evita que o clique propague para a linha

        const recordId = event.currentTarget.dataset.id;

        // Buscar o objeto correspondente
        const record = findRecord(this.processedMainRecords.data, recordId);

        if (record) {
            const actionClickEvent = new CustomEvent('actionclick', {
                detail: { record }
            });

            this.dispatchEvent(actionClickEvent);
        }

        console.debug('handleActionClick', JSON.stringify(record));
    }

    handleRowAction(event) {
        event.stopPropagation();
        const recordId = event.currentTarget.dataset.id;
        const actionName = event.detail.value;
        const record = findRecord(this.processedMainRecords.data, recordId)

        if (record) {
            this.dispatchEvent(new CustomEvent('rowaction', {
                detail: { record, actionName }
            }));
        }
    }

    handleNavigateClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const recordId = event.currentTarget.dataset.id;
        const fieldName = event.currentTarget.dataset.field;
        const record = findRecord(this.processedMainRecords.data, recordId)

        if (record) {
            this.dispatchEvent(new CustomEvent('navigate', {
                detail: { recordId, record, fieldName }
            }));
        }
    }
    
}
