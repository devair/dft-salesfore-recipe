import { LightningElement, wire, track } from 'lwc';
import getAccountsWithChildren from '@salesforce/apex/AccountContactController.getAccountsWithChildren';
import { NavigationMixin } from 'lightning/navigation';
import FORM_FACTOR from '@salesforce/client/formFactor';
import { refreshApex } from "@salesforce/apex";

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
    { label: 'Telefone', fieldName: 'phone', type: 'phone'        
    },
    { label: 'Status', fieldName: 'status', type: 'text',
        cellAttributes: {
            iconName: { fieldName: 'statusIcon'},
            iconPosition: 'left',
            iconVariant: { fieldName: 'statusIconVariant'},            
            class: 'vibrant-pink-50-icon',
        },
    },
    { 
        label: 'Web Site', 
        fieldName: 'webSite', 
        type: 'url', 
        typeAttributes: { 
            label: { fieldName: 'webSite' }, 
            target: '_self',        
        } 
    },
    { label: 'Pedidos em Carteira', fieldName: 'backlogOrders', type: 'link' },   
    { label: 'One Page', 
        type: 'button', 
        typeAttributes: { 
            label: { fieldName: 'backlogOrders' },
            iconName: 'utility:company', 
            name: 'onePage',
            label: 'One page'
        },
        cellAttributes: { class: { fieldName: 'buttonVisibility' } } // Controla visibilidade
    }
    
];


export default class HubEconomicGroups extends NavigationMixin(LightningElement) {
    @track treeData = [];    
    @track searchTerm ='';
    @track offset = 0;
    @track hasMoreData = true;

    isMobile = FORM_FACTOR === 'Small';    
    columns = COLUMNS;
    
    activeSections = [];

    @track mainRecords;
        
    searchTimeout;
    

    
    @wire(getAccountsWithChildren, { searchTerm: '$searchTerm'})
    wiredAccounts({ error, data }) {
        if (data) {            
            //this.treeData = this.formatTreeData(data);     
            this.mainRecords = this.formatDataGrid(data);                        
            
        } else if (error) {
            console.error('Erro ao carregar contas:', error);            
        }        
    }

/*
    formatTreeData(accounts) {
        
        let treeData = accounts.map(account => ({
            id: account.id,
            name: account.name,                
            phone: account.phone,
            status: account.status,  
            recordUrl: `/${account.id}`,
            parentId: account.id,            
            webSite: account.webSite,
            _children: account.children?.map(child => ({
                id: child.id,
                name: child.name,
                phone: child.phone,
                status: child.status,
                recordUrl: `/${child.id}`,
                parentId: child.parentId,
                parentUrl: `/${account.id}`,
                parentName: account.name,      
                webSite: child.webSite                
            }))
        }));
        
        return treeData;
    }
*/
    
    formatDataGrid(accounts) {
        
        const columns = COLUMNS;

        const data = accounts.map(account => 
            {                               
                const root = {                
                    id: account.id,
                    name: account.name,                
                    phone: account.phone,
                    status: account.status,  
                    recordUrl: `/${account.id}`,
                    parentId: account.id,
                    buttonVisibility: '',
                    status: account.status,           
                    statusIcon: 'utility:error',
                    statusIconVariant: 'error',
                    webSite: account.webSite,
                    backlogOrders: account.backlogOrders,
                    backlogOrdersUrl: `/${account.id}`
                }

                const processedChildren = (children) => {

                    const dataChild = children.map(child => (
                        {
                            id: child.id,
                            name: child.name,
                            phone: child.phone,
                            status: child.status,
                            recordUrl: `/${child.id}`,
                            parentId: child.parentId,
                            status: child.status,
                            statusIcon: 'utility:success',
                            statusIconVariant: 'success',
                            parentUrl: `/${account.id}`,
                            parentName: account.name,     
                            webSite: child.webSite,
                        })                            
                    );

                    let childReturn;
                    if(dataChild){
                        childReturn = {
                            columns: columns, data: dataChild
                        }
                    }

                    return  childReturn;                    
                }; 
                
                return {
                    ...root,
                    children: account?.children ? processedChildren(account.children) : undefined
                }
            }         
        )        
        const formattedData = { columns: columns, data: data};        
        return formattedData;                
    }

    handleSearchChange(event){
        const searchTerm = event.target.value;
        this.searchTerm = searchTerm;
        
        // Limpando o timeout anterior se o usuário continuar digitando
        clearTimeout(this.searchTimeout);

        // Aplicando debounce de 500ms
        this.searchTimeout = setTimeout(async () => {
            await refreshApex(this.wiredAccounts);              
            this.handleRefreshDataGrid(this.searchTerm ? true : false);                                  
        }, 500);
    }

    handleRefreshDataGrid(expanded) {
        const childComponent = this.template.querySelector('c-data-grid');
        if (childComponent) {
            childComponent.refreshData(expanded); // Chamando o método público do filho
        }


        const childComponentTeporario = this.template.querySelector('c-dynamic-html-table');
        if (childComponentTeporario) {
            childComponentTeporario.refreshData(expanded); // Chamando o método público do filho
        }        
    }



    navigateToOrderPage(event) {
        const { recordId, fieldName } = event.detail;
        

        switch (fieldName) {
            case 'backlogOrders':

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

                break;
        
            default:
                break;
        }
    }
}