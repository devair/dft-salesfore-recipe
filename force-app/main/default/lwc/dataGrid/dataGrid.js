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

    handleNavigateClick(event) {
        event.preventDefault();
        const recordId = event.detail.recordId;
        const fieldName = event.detail.fieldName;
        const record = findRecord(this.processedMainRecords.data, recordId)

        if (record) {
            this.dispatchEvent(new CustomEvent('navigate', {
                detail: { recordId, record, fieldName },
                bubbles: true,
                composed: true
            }));
        }
    }
    
}
