import { LightningElement, api, track } from 'lwc';

export default class DataGrid extends LightningElement {
    @api mainRecords;  
    @api refresh;

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
            this.processedMainRecords = this.processRecords(this.mainRecords.data, this.mainRecords.columns, expanded);  
        }
        else{
            this.showNoData = true;
        }
    }

    processRecords(records, columns, expanded) {

        const data = records.map(record => {
            
            const urlLabel = (record, column) => {
                const field = column?.typeAttributes?.label?.fieldName;
                const value = field ? record[field]: '';
                return value;
            }

            const cells = columns.map((column, index) => ({
                firstField: index === 0,
                fieldName: column.fieldName,
                label: column.label,
                value: record[column.fieldName] || '',
                isDate: column.type === 'date',
                isNumber: column.type === 'number',
                isCurrency: column.type === 'currency',
                isUrl: column.type === 'url',
                urlLabel: column.type === 'url' ? urlLabel(record, column) : ''                      
            }));
            
    
            const processedChildren = (children) => {
                return children ? this.processRecords(children.data, children.columns) : null;
            };
    
            const hasChildren = record?.children?.data && record?.children?.data.length > 0 ? true : false ;

            return {
                ...record,
                cells,                
                expanded: `expanded-${record.id}`,
                hasChildren: hasChildren,
                children: hasChildren? processedChildren(record.children) : undefined,                
                isExpanded: hasChildren && expanded ? true : false,
                icon: 'utility:chevronright'
            };            
        });

        return {
            columns: columns,
            data: data
        }
    }

   
    handleExpand(event, level) {
        const recordId = event.currentTarget.dataset.id;

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