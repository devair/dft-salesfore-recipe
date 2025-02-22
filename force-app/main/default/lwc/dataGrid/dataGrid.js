import { LightningElement, api, track } from 'lwc';

export default class DataGrid extends LightningElement {
    @api mainRecords = [];    
    @track processedMainRecords;
    expandedItems = [];

    connectedCallback() {        
        this.processedMainRecords = this.processRecords(this.mainRecords.data, this.mainRecords.columns);
    }

    processRecords(records, columns) {

        const data = records.map(record => {
            const cells = columns.map((column, index) => ({
                firstField: index === 0,
                fieldName: column.fieldName,
                label: column.label,
                value: record[column.fieldName] || '',
                isDate: column.type === 'date',
                isNumber: column.type === 'number',
                isCurrency: column.type === 'currency'
            }));
    
            const processedChildren = (children) => {
                return children ? this.processRecords(children.data, children.columns) : null;
            };
    
            return {
                ...record,
                cells,                
                expanded: `expanded-${record.id}`,
                hasChildren: record?.children ? true : false,
                children: processedChildren(record.children),                
                isExpanded: false,
                icon: 'utility:chevronright'
            };            
        });

        return {
            columns: columns,
            data: data
        }
    }

   
    handleExpand(event, level) {
        const recordId = parseInt(event.currentTarget.dataset.id, 10);

        // Função recursiva para encontrar o registro
        const findRecord = (records, targetId) => {
            for (const record of records) {
                if (record.id === targetId) {
                    return record;
                }
                if (record.children?.data) {
                    const found = findRecord(record.children.data, targetId);
                    if (found) return found;
                }
            }
            return null;
        };

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
}