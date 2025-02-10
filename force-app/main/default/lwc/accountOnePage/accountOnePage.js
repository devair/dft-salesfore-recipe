import { LightningElement, api } from 'lwc';

export default class AccountOnePage extends LightningElement {

    @api recordId;
    objectApiName = 'Account';
 
    connectedCallback(){
        console.log(this.recordId);        
    }
}