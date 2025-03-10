import { LightningElement, api, track } from 'lwc';

export default class ExpandableTable extends LightningElement {
    @api columns = [];
    @api records = [];
    @track displayedRows = [];
    isRendered = false;
    expandedState = new Map(); 
    
    connectedCallback() {
        this.renderTable();
    }

    renderedCallback() {
        if(!this.isRendered){
            this.isRendered = true;
            this.renderTable();
        }        
    }

    renderTable() {
        const tbody = this.template.querySelector('tbody');
        
        if (!tbody) {
            console.error('tbody não encontrado');
            return;
        }

        if (tbody) tbody.innerHTML = '';
        this.displayedRows = [];
        this.processHierarchy(this.records, 0, tbody);
    }

    processHierarchy(records, level, tbody) {
        records.forEach((rec) => {
            const isExpanded = this.expandedState.get(rec.id) || false;
            const row = document.createElement('tr');
            row.innerHTML = this.createRowHTML(rec, level, isExpanded);
            tbody.appendChild(row);

            const toggleBtn = row.querySelector(`button[data-id="${rec.id}"]`);
            if (toggleBtn) toggleBtn.addEventListener('click', () => this.handleToggleRow(rec.id));

            const actionBtn = row.querySelector(`button[data-action-id="${rec.id}"]`);
            if (actionBtn) actionBtn.addEventListener('click', () => this.handleCustomAction(rec));

            if (isExpanded && rec.children) {
                this.processHierarchy(rec.children, level + 1, tbody);
            }
        });
    }

    createRowHTML(record, level) {
        const indentStyle = `padding-left: ${level * 20}px;`;
        const toggleIcon = record.children ? (record.expanded ? '▼' : '▶') : '';
        const toggleBtn = record.children
            ? `<button class="slds-button slds-button_icon" data-id="${record.id}" title="Toggle">${toggleIcon}</button>`
            : '';

        const columnsHTML = this.columns
            .map((col) => `<td>${this.formatCell(record, col, indentStyle)}</td>`)
            .join('');

        return `
            <td>${toggleBtn}</td>
            ${columnsHTML}
            <td><button class="slds-button slds-button_neutral" data-action-id="${record.id}">Ação</button></td>
        `;
    }

    formatCell(record, column, indentStyle) {
        const value = this.resolveField(record, column.fieldName);
        if (value === undefined || value === null) return '';

        switch (column.type) {
            case 'currency':
                return `<div class="slds-truncate" style="${indentStyle}">${new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: column.currencyCode || 'BRL'
                }).format(value)}</div>`;
            case 'decimal':
                return `<div class="slds-truncate" style="${indentStyle}">${parseFloat(value).toFixed(column.scale || 2)}</div>`;
            case 'datetime':
                return `<div class="slds-truncate" style="${indentStyle}">${new Date(value).toLocaleString('pt-BR')}</div>`;
            case 'date':
                return `<div class="slds-truncate" style="${indentStyle}">${new Date(value).toLocaleDateString('pt-BR')}</div>`;
            case 'link':
                return `<div class="slds-truncate" style="${indentStyle}"><a href="${value}" target="_blank">${column.label || 'Link'}</a></div>`;
            case 'button':
                return `<div class="slds-truncate" style="${indentStyle}"><button class="slds-button slds-button_brand" data-btn-id="${record.id}">${column.label || 'Clique'}</button></div>`;
            default:
                return `<div class="slds-truncate" style="${indentStyle}">${value}</div>`;
        }
    }

    resolveField(record, fieldPath) {
        return fieldPath.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), record);
    }

    handleToggleRow(id) {
        const currentState = this.expandedState.get(id) || false;
        this.expandedState.set(id, !currentState); 
        this.renderTable();
    }

    toggleExpansion(id, records) {
        for (const rec of records) {
            if (rec.id === id) rec.expanded = !rec.expanded;
            else if (rec.children) this.toggleExpansion(id, rec.children);
        }
    }

    handleCustomAction(record) {
        this.dispatchEvent(new CustomEvent('customaction', { detail: record }));
    }
}
