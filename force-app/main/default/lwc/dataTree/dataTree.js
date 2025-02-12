import { LightningElement, wire, track } from 'lwc';
import getAccountsWithChildren from '@salesforce/apex/AccountContactController.getAccountsWithChildren';
import { NavigationMixin } from 'lightning/navigation';
import FORM_FACTOR from '@salesforce/client/formFactor';

const COLUMNS = [    
    { 
        label: 'Nome', 
        fieldName: 'recordUrl', 
        type: 'url', 
        typeAttributes: { 
            label: { fieldName: 'name' }, 
            target: '_self',        
        } 
    },
    { label: 'Telefone', fieldName: 'phone', type: 'phone' },
    { label: 'Status', fieldName: 'status', type: 'text' },
    { label: 'One Page', 
        type: 'button', 
        typeAttributes: { 
            iconName: 'utility:company', 
            name: 'onePage',
            label: ''
        },
        cellAttributes: { class: { fieldName: 'buttonVisibility' } } // Controla visibilidade
    }
];

export default class DataTDataTreereeLWC extends NavigationMixin(LightningElement) {
    
    @track treeData = [];    
    @track searchTerm ='';
    @track offset = 0;
    @track hasMoreData = true;

    isMobile = FORM_FACTOR === 'Small';    
    columns = COLUMNS;
    
    @wire(getAccountsWithChildren, { searchTerm: '$searchTerm'})
    wiredAccounts({ error, data }) {
        if (data) {            
            this.treeData = this.formatTreeData(data);            
        } else if (error) {
            console.error('Erro ao carregar contas:', error);            
        }        
    }

    formatTreeData(accounts) {
        
        let treeData = accounts.map(account => ({
            id: account.id,
            name: account.name,                
            phone: account.phone,
            status: account.status,  
            recordUrl: `/${account.id}`,
            parentId: account.id,
            buttonVisibility: '',
            _children: account.children?.map(child => ({
                id: child.id,
                name: child.name,
                phone: child.phone,
                status: child.status,
                recordUrl: `/${child.id}`,
                parentId: child.parentId,
                buttonVisibility: 'slds-hidden' // Esconde o botão para filhos
            }))
        }));
        
        return treeData;
    }

    connectedCallback() {
        console.log('The device form factor is: ' + FORM_FACTOR);        
    }

    renderedCallback(){
        const grid =  this.template.querySelector('lightning-tree-grid');

        if(this.searchTerm){
            if(grid) grid.expandAll();
        }
        else {
            if(grid) grid.collapseAll();
        }
    } 
    
    handleRowAction(event) {
        const recordId = event.detail.row.parentId;
        const actionName = event.detail.action.name;

        if (actionName === 'onePage') {
            this.openLightningTab(recordId);
        }
    }

    handleOnePage(event){
        const recordId = event.target.value;
        this.openLightningTab(recordId);
    }

    openLightningTab(recordId) {
        let direction = {
            componentDef: 'c:accountOnePage',
            attributes: {
                recordId: recordId
            }
        }

        let encodeDef = btoa(JSON.stringify(direction));

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {url: '/one/one.app#'+encodeDef}
        });
    }

    handleSearchChange(event){
        const searchTerm = event.target.value;
        this.searchTerm = searchTerm;
    }
}