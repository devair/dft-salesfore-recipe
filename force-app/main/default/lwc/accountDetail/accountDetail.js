import { LightningElement, api } from 'lwc';

export default class AccountDetail extends LightningElement {

    @api account;
    @api showNameField = false;
}