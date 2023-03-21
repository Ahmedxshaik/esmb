import { LightningElement,api, wire,track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import accountRelatedOpportunities from '@salesforce/apex/AccountRelatedContactsAndOpportunities.accountRelatedOpportunities';
import accountRelatedContacts from '@salesforce/apex/AccountRelatedContactsAndOpportunities.accountRelatedContacts';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import ORGANIZATIONNAME_FIELD from '@salesforce/schema/Lead__c.Company__c';
import FIRSTNAME_FIELD from '@salesforce/schema/Lead__c.FirstName__c';
import LASTNAME_FIELD from '@salesforce/schema/Lead__c.Name';
import PHONE_FIELD from '@salesforce/schema/Lead__c.Phone__c';
import EMAIL_FIELD from '@salesforce/schema/Lead__c.Email__c';
//import OWNERNAME_FIELD from '@salesforce/schema/Lead__c.Owner.Name';
//import USER_ID from '@salesforce/user/Id';
//import USERNAME_FIELD from '@salesforce/schema/User.Name';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import { updateRecord } from 'lightning/uiRecordApi';
import ACCOUNTID_FIELD from '@salesforce/schema/Account.Id';
import CONTACT_OBJECT from '@salesforce/schema/Contact';
import CONTACTID_FIELD from '@salesforce/schema/Contact.Id';
 import CONTACTNAME_FIELD from '@salesforce/schema/Contact.LastName';
 import CONTACTACCOUNTID_FIELD from '@salesforce/schema/Contact.AccountId';
 import CONTACTFIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
 import CONTACTPHONENUMBER_FIELD from '@salesforce/schema/Contact.Phone';
 import CONTACTEMAIL_FIELD from '@salesforce/schema/Contact.Email';
 import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity__c';
import OPPORTUNITYNAME_FIELD from '@salesforce/schema/Opportunity__c.Name';
import STAGE_FIELD from '@salesforce/schema/Opportunity__c.StageName__c';
import CLOSEDATE_FIELD from  '@salesforce/schema/Opportunity__c.CloseDate__c';
import ACCOUNTOPPORTUNITYID_FIELD from '@salesforce/schema/Opportunity__c.AccountId__c';
import PROBABILITY_FIELD from '@salesforce/schema/Opportunity__c.Probability__c';  
import { deleteRecord } from 'lightning/uiRecordApi';


var x=0;

const fields = [ORGANIZATIONNAME_FIELD,FIRSTNAME_FIELD, LASTNAME_FIELD,PHONE_FIELD,EMAIL_FIELD,'Lead__c.Owner.Name'];
export default class LeadConversion extends NavigationMixin(LightningElement) {
    activeSections = ['A'];
    activeSectionsMessage = '';

    handleSectionToggle(event) {
        const openSections = event.detail.openSections;

        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections.join(', ');
        }
    }

    value='Qualified';
    @api recordId;
    @api objectApiName = 'Lead__c';
    @track disableOpportunity =false;
    @track matchOpportunity =true;
    @track accountName;  
    @track accountRecordId;  
    @track contactName;
    @track contactRecordId;
    @track contactCompanyName;
    @track checkIfAccountIsSelectedORNot=false;
   @track checkacctselectionvalidity=false;
    @track checkIfOpportunityIsSelectedORNot=false;
    @track contackLookUpSelectionDisable=true;
    @track accountSelected=false;
    @track opportunityLooUpSelectionDisable=true;
    @track accIdForOpportunity;
    @track accIdForContact;
    @track showOpportunitiesSelected=false;
    @track checkvalForAccount=true;
    @track checkvalForContact=true;
    @track  checkvalForOpportunity=true;
    @track checkvalForOpportunitySelection=false;
    @track contactFirstName;
    @track conatctPhoneNumber;
    @track contactEmailId;
    @track opportunityId;
    @track opportunityName;
   @track opportunityStage = 'prospecting';
   @track opportunityCloseDate = '2020-09-30';
   @track opportunityprobability='10%';
   @track ifAccountNotOnChange=true;
   @track ifContactFirstNameNotOnChange=true;
   @track ifContactLastNameNotOnChange=true;
   @track ifOpportunityNotOnChange=true;
  @track checkIfContactIsSelectedORNot=false;
  @track ifContactPhoneNumberNotOnChange=true;
  @track ifContactEmailNotOnChange=true;
  @api contactplaceholdertext='0 Contact Matches detected';
  @api opportunitySelectionToBeDisplayed;
  @api intoaccountcreationchnages=false;
  @track accountnamechnaged;
  @api intocontactlastnamecreationchnages=false;
  @track contactlastnamechanged;
  @api intoopportunitycreationchanges=false;
  @track opportunitynamechanged;
  @track recdelted=false;
  @track acccreated=false;
    @wire(getRecord, { recordId: '$recordId', fields })
        Lead__c;
       /* @track error ; 
        @track name;
        @wire(getRecord, {
            recordId: USER_ID,
            fields: [ USERNAME_FIELD]
        }) wireuser({
            error,
            data
        }) {
            if (error) {
               this.error = error ; 
            } else if (data) {
                this.name = data.fields.Name.value;
            }
        }*/
        oppextension="-";
        get companyname(){
          
            return getFieldValue(this.Lead__c.data,ORGANIZATIONNAME_FIELD)
        }
        get opportunitynamefield(){
                       return getFieldValue(this.Lead__c.data , ORGANIZATIONNAME_FIELD)
        }
        get firstname(){
           
            return getFieldValue(this.Lead__c.data,FIRSTNAME_FIELD)
        }
        
        get lastname(){
   
                    return getFieldValue(this.Lead__c.data,LASTNAME_FIELD)
        }  
        get contactphone(){
            return getFieldValue(this.Lead__c.data,PHONE_FIELD)
        }
        get contactemail(){
            return getFieldValue(this.Lead__c.data,EMAIL_FIELD)       
         }
         get ownername(){
             return getFieldValue(this.Lead__c.data,'Lead__c.Owner.Name')
         }
   
    
    get statusoptions() {
        return [
            { label: 'Qualified', value: 'Qualified'},
            
        ];
    }
    handleSelection(event){
        console.log("the selected record id is"+event.detail);
    }
   
    handleChange(event) {
        this.value = event.detail.value;
     } 
     @track checkval=true;      
     @api disable=false;
     @track checkvalOne=false;
      @track checkForOpportunityBeforeAccount;                                                      
     handleOpportunityCreation(){
        
        if(this.template.querySelector(".opportunityCreationCheckbox").checked){
            this.checkvalForOpportunity=false;
            this.checkvalForOpportunitySelection=false;
            this.template.querySelector(".firstRadioOpportunitycls").disabled=true;
            this.template.querySelector(".secondRadioOpportunitycls").disabled=true;
            this.checkval=false;
            this.checkvalOne=true;
            this.checkForOpportunityBeforeAccount=true;
       
        }
        else{
           
            this.checkForOpportunityBeforeAccount=false;
       this.template.querySelector(".firstRadioOpportunitycls").disabled=false;
      this.template.querySelector(".secondRadioOpportunitycls").disabled=false;
       this.checkval=true;
       this.checkvalOne=false;
       this.checkvalForOpportunity=true;
        }
     }

     handleOnclickAccountCreation(){
        this.checkvalForAccount=true;
        this.mustFillFields=false; 
        if( this.template.querySelector(".accountRadioSelectionClass").checked === false && this.intoaccountcreationchnages === true){
                 this.accountName=this.accountnamechnaged;
        }
       else if(this.template.querySelector(".accountRadioSelectionClass").checked === false && this.intoaccountcreationchnages === false){
           this.ifAccountNotOnChange=true;
       }
       
     }
     handleOnClickContactCreation(){
         this.checkvalForContact=true;
         this.mustFillFields=false;
         this.displayMsg=false;
         this.continueExecution=false;
         if(this.template.querySelector(".contactRadioSelectionClass").checked === false && this.intocontactlastnamecreationchnages === true){
             this.contactName=this.contactlastnamechanged;
         }
         else if(this.template.querySelector(".contactRadioSelectionClass").checked === false && this.intocontactlastnamecreationchnages === false){
            
             this.ifContactLastNameNotOnChange=true;
         this.ifContactFirstNameNotOnChange=true;
         this.ifContactPhoneNumberNotOnChange=true;
         this.ifContactEmailNotOnChange=true;
         }
         
     }
     handleOnClickOpportunityCreation(){
         this.checkvalForOpportunity=true;
         this.mustFillFields=false;
         if(this.template.querySelector(".secondRadioOpportunitycls").checked === false && this.intoopportunitycreationchanges === true){
             this.opportunityName=this.opportunitynamechanged;
         }
         else if(this.template.querySelector(".secondRadioOpportunitycls").checked === false && this.intoopportunitycreationchanges === false){
            this.ifOpportunityNotOnChange=true;
         }
        
     }
     onAccountCreation(event){
        this.ifAccountNotOnChange=false;
        if(this.template.querySelector(".accountRadioCreationClass").checked)
                this.accountName=event.target.value;  
                this.intoaccountcreationchnages=true;
                this.accountnamechnaged=this.accountName;
         this.makemsgdiable();  
     }
     onAccountSelection(event){  
         if(this.template.querySelector(".opportunityCreationCheckbox").checked){
             this.opportunityLooUpSelectionDisable=true;
         }
         else{
            this.opportunityLooUpSelectionDisable=false;
         }
        this.ifAccountNotOnChange=false;
        this.checkvalForAccount=false;
       this.accountName = event.detail.selectedValue;  
       this.accountRecordId = event.detail.selectedRecordId; 
       this.accIdForOpportunity=this.accountRecordId;
       this.accIdForContact=this.accountRecordId;
       this.checkIfAccountIsSelectedORNot=true; 
       //this.template.querySelector(".accountRadioCreationClass").checked=false;
       this.template.querySelector(".accountRadioSelectionClass").checked=true;
       this.makemsgdiable();
       
     }
        handleClickAccountSelection(){
            if(this.accountName === undefined){
                this.checkIfAccountIsSelectedORNot=false;
            }
        }
        
        handleContactFirstName(event){
            this.ifContactFirstNameNotOnChange=false;
            this.contactFirstName=event.target.value;

        }
        handleContactLastName(event){
            this.ifContactLastNameNotOnChange=false;
            if(this.template.querySelector(".contactRadioCreationClass").checked)
                  this.contactName=event.target.value;
                  this.intocontactlastnamecreationchnages=true;
                  this.contactlastnamechanged=this.contactName;
             this.makemsgdiable();
            
        }
        handleContactPhoneNumber(event)
        {
            this.ifContactPhoneNumberNotOnChange=false;
             this.conatctPhoneNumber=event.target.value;
        }
        handleContactEmail(event){
            this.ifContactEmailNotOnChange=false;
            this.contactEmailId=event.target.value;
        }
        handleClickContactSelection(){
            
            this.checkvalForContact=false;
            this.contackLookUpSelectionDisable=false;
            if(this.template.querySelector(".contactRadioSelectionClass").checked){
                this.contactplaceholdertext = 'Search for matching contacts';
   
            }
            if(this.contactName === undefined){
                this.checkIfContactIsSelectedORNot=false;
            }

     }
     onContactSelection(event){
        this.ifContactLastNameNotOnChange=false;
        this.ifContactFirstNameNotOnChange=false;
        this.contactName = event.detail.selectedValue;
        this.contactRecordId = event.detail.selectedRecordId;
        this.checkIfContactIsSelectedORNot= true;

        if(this.checkIfContactIsSelectedORNot === true)
             {

                    accountRelatedContacts({accId:this.accountRecordId,searchkey:this.contactRecordId})
                           .then(result =>{
                             if(result === true)
                         this.displayMsg=result;
                                else
                                this.displayMsg=false;
                             })
                        .catch(error => {
                         this.errorMsg = error;
                      });
         }
         this.makemsgdiable();
                                        
      }
      
      handleOpportunityName(event){
          this.ifOpportunityNotOnChange=false;
          if(this.template.querySelector(".firstRadioOpportunitycls").checked)
                     this.opportunityName=event.target.value;
                     this.intoopportunitycreationchanges=true;
                     this.opportunitynamechanged=this.opportunityName;
          this.makemsgdiable();

      }
      @track contacts;
      @track accountsWithOpportunities;
      @track error;
      @wire(accountRelatedOpportunities,{ accId:'$accIdForOpportunity'})
      wiredAccountsWithOppoertunityResult({data,error}){
          if(data)
          {
              this.accountsWithOpportunities=data;
              
          }
          else if(error){
             // console.log(error);               
              this.error=error;
          }
      }
      handleClickOpportunitySelection(){
          this.checkvalForOpportunitySelection=true;
          this.checkvalForOpportunity=false;
          this.opportunityLooUpSelectionDisable=false;
        
          this.showOpportunitiesSelected=true;
   
      }
@track contacts;
@track contactsList=[];
@track matchingContactList=[];
@track errorMsg;
 @track displayMsg=false;
 @track y=0;
@track opportunitySelectedValue;
@track mustFillFields=false;
@api continueExecution;
@api displaycont;
@api opportunitySelectedValueORNot(){
 
    if(this.template.querySelector(".opportunitySelectedValueFromList").checked){
        this.opportunitySelectionToBeDisplayed="Opportunity Selected";
   }
   else{
       this.opportunitySelectionToBeDisplayed="";
   }
}
handleSelectedOpportunityRelatedToAccount(event){

    this.ifOpportunityNotOnChange=false;
    this.opportunitySelectedValue=event.target.value;
    this.checkIfOpportunityIsSelectedORNot=true;
    if(this.opportunitySelectedValue === undefined)
    {
        this.checkIfOpportunityIsSelectedORNot=false;

    }
    this.opportunitySelectedValueORNot();
  this.makemsgdiable();
}
    @api makemsgdiable(){
        if(this.checkIfAccountIsSelectedORNot === true || this.checkIfContactIsSelectedORNot === true || this.accountName!="" || this.contactName!="" ||this.opportunitySelectionToBeDisplayed!=""){
            this.mustFillFields = false;
        }
    }
    
  @api navigateToAccountPage() {
    deleteRecord(this.recordId)
    .then(() => {
      
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Record deleted',
                variant: 'success'
            })
            
        );
        
    })
    .catch(error => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error deleting record',
                message: error.body.message,
                variant: 'error'
            })
        );
    });
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            "recordId": this.accountRecordId,
            "objectApiName": "Account",
            "actionName": "view"
        },
    });
      
      }
   
convertDetails() 
     {
       
        if(this.template.querySelector(".accountRadioCreationClass").checked && this.accountName === ""){
            this.mustFillFields=true;
        }
        
        if(this.template.querySelector(".contactRadioCreationClass").checked && this.contactName === ""){
            this.mustFillFields=true;
        }
       
        if(this.template.querySelector(".firstRadioOpportunitycls").checked && this.opportunityName === "" ){
            this.mustFillFields=true;
        }
        if(this.template.querySelector(".opportunityCreationCheckbox").checked && this.opportunityName === "" && this.accountName === null && this.contactName === null){
            this.mustFillFields=false;
        }
        
let flag= this.template .querySelectorAll("c-lead-conversion-custom-lookup");
  
if((this.template.querySelector(".accountRadioSelectionClass").checked && this.checkIfAccountIsSelectedORNot === false) || (this.template.querySelector(".accountRadioSelectionClass").checked && this.accountName === null)){
    flag[0].recordSelectionValidation();
   this.checkvalForAccount = false;
   this.mustFillFields = true;
}

 if((this.template.querySelector(".contactRadioSelectionClass").checked && this.checkIfContactIsSelectedORNot === false) || (this.template.querySelector(".contactRadioSelectionClass").checked && this.contactName === null)){
    flag[1].recordSelectionValidation();
    this.mustFillFields = true;  
}
if((this.template.querySelector(".secondRadioOpportunitycls").checked && this.checkIfOpportunityIsSelectedORNot === false) || (this.template.querySelector(".secondRadioOpportunitycls").checked && this.opportunitySelectedValue === null)){
    var oppLookUpSelectedValue = this.template.querySelector(".oppUpdationRecordSelection");
    var oppvalue = oppLookUpSelectedValue.value;
    
    if ( oppvalue === "") {
        this.mustFillFields = true;  
        oppLookUpSelectedValue.setCustomValidity("Please choose an existing Opportunity or create a new one");
      
    } else {
        oppLookUpSelectedValue.setCustomValidity(""); // if there was a custom error before, reset it
    }
    oppLookUpSelectedValue.reportValidity(); // Tells lightning-input to show the error right away without needing interaction
  
}
if(this.template.querySelector(".opportunityCreationCheckbox").checked && this.opportunitySelectedValue === undefined && this.accountName === null && this.contactName === null){
    this.mustFillFields=false;
}

       if(this.displayMsg === true)
         {
             this.continueExecution=true; 
         }
       else if(this.displayMsg === false && this.mustFillFields === false) 
       {
          
              this.continueExecution=false;
              if(this.ifAccountNotOnChange === true)
              {
                  this.accountName=this.companyname;
              }
             if(this.ifContactFirstNameNotOnChange === true){
                 this.contactFirstName=this.firstname;
             }
             if(this.ifContactLastNameNotOnChange === true)
             {
                 this.contactName=this.lastname;
             }
             if(this.ifContactPhoneNumberNotOnChange === true){
                 this.conatctPhoneNumber=this.contactphone;
             }
             if(this.ifContactEmailNotOnChange === true){
                 this.contactEmailId=this.contactemail;
             }
             if(this.ifOpportunityNotOnChange === true)
             {
                 this.opportunityName=this.opportunitynamefield;
             }
            
  if((this.template.querySelector(".accountRadioCreationClass").checked) && (this.template.querySelector(".contactRadioCreationClass").checked) && !(this.template.querySelector(".firstRadioOpportunitycls").checked) && !(this.template.querySelector(".secondRadioOpportunitycls").checked))  
        {
           
            const fields = {};
            fields[NAME_FIELD.fieldApiName] = this.accountName;
            const accRecordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
            // create account record
            createRecord(accRecordInput)
                .then(account => {
                    this.accountRecordId = account.id;
                    this.acccreated=true;
                    this.dispatchEvent(
                        
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Account created with id'+this.accountRecordId,
                            variant: 'success',
                        }),
                       
                    );
                
              //create related contact
             const fields_Contact = {};
              fields_Contact[CONTACTNAME_FIELD.fieldApiName] = this.contactName;//set contact name
              fields_Contact[CONTACTFIRSTNAME_FIELD.fieldApiName] = this.contactFirstName;
              fields_Contact[CONTACTEMAIL_FIELD.fieldApiName] = this.contactEmailId;
              fields_Contact[CONTACTPHONENUMBER_FIELD.fieldApiName] = this.conatctPhoneNumber;
              fields_Contact[CONTACTACCOUNTID_FIELD.fieldApiName] = this.accountRecordId;//set parent account
              const contRecordInput = { apiName: CONTACT_OBJECT.objectApiName,
                fields : fields_Contact};
                   //create contact
                   createRecord(contRecordInput)
                   .then(contact =>{
                       this.contactRecordId= contact.id;
                       this.dispatchEvent(
                           new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact created',
                            variant: 'success',
                           }),
                       );
                   
                    })
                    .catch(error => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Error creating record',
                                message: error.body.message,
                                variant: 'error',
                            }),
                        );
                    });
            })

        }

else if((this.template.querySelector(".accountRadioSelectionClass").checked) && (this.template.querySelector(".contactRadioSelectionClass").checked) && !(this.template.querySelector(".firstRadioOpportunitycls").checked) && !(this.template.querySelector(".secondRadioOpportunitycls").checked))
{
                                                  //update account
                    let record = {
                        fields: {
                             Id: this.accountRecordId,
                            Name: this.accountName
                                        },
                                       };
        
                   updateRecord(record)
                       .then(()=> {
                           this.dispatchEvent(
                             new ShowToastEvent({
                               title: 'Success',
                              message: 'Account with'+  this.accountRecordId  +'     has been updated successfully.',
                            variant: 'success',
                       }),
                                    );
        
                  //update contact record
           let record = {
              fields: {
                Id: this.contactRecordId,
               //LastName:this.contactName,
               //Phone:this.conatctPhoneNumber,
               //Email:this.contactEmailId,
              AccountId:this.accountRecordId
                },
                 };
           updateRecord(record)
               .then(()=> {
                 this.dispatchEvent(
                   new ShowToastEvent({
                         title: 'Success',
                   message: 'Conatct with'+  this.contactRecordId  +'     has been updated successfully.',
                    variant: 'success',
                 }),
                 );
        
        
        
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error',
                        }),
                    );
                });
        })
                      
}
else if((this.template.querySelector(".accountRadioCreationClass").checked)&&(this.template.querySelector(".contactRadioSelectionClass").checked) && !(this.template.querySelector(".firstRadioOpportunitycls").checked) && !(this.template.querySelector(".secondRadioOpportunitycls").checked))
{ 
   

    const fields = {};
    fields[NAME_FIELD.fieldApiName] = this.accountName;
    const accRecordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
    // create account record
    createRecord(accRecordInput)
        .then(account => {
            this.accountRecordId = account.id;
            this.acccreated=true;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account created with id'+this.accountRecordId,
                    variant: 'success',
                }),
            );
                           
            let record = {
                fields: {
                  Id: this.contactRecordId,
                // LastName:this.contactName,
                // Phone:this.conatctPhoneNumber,
                // Email:this.contactEmailId,
                AccountId:this.accountRecordId
                  },
                   };
             updateRecord(record)
                 .then(()=> {
                   this.dispatchEvent(
                     new ShowToastEvent({
                           title: 'Success',
                     message: 'Conatct with'+  this.contactRecordId  +'     has been updated successfully.',
                      variant: 'success',
                   }),
                   );
          
                  })
                  .catch(error => {
                      this.dispatchEvent(
                          new ShowToastEvent({
                              title: 'Error creating record',
                              message: error.body.message,
                              variant: 'error',
                          }),
                      );
                  });
          })

}

else if((this.template.querySelector(".accountRadioSelectionClass").checked) && (this.template.querySelector(".contactRadioCreationClass").checked)  && !(this.template.querySelector(".firstRadioOpportunitycls").checked) && !(this.template.querySelector(".secondRadioOpportunitycls").checked)){
    
    let record = {
        fields: {
             Id: this.accountRecordId,
            Name: this.accountName
                        },
                       };

   updateRecord(record)
       .then(()=> {
           this.dispatchEvent(
             new ShowToastEvent({
               title: 'Success',
              message: 'Account with'+  this.accountRecordId  +'     has been updated successfully.',
            variant: 'success',
       }),
                    );
    //create contact
    const fields_Contact = {};
    fields_Contact[CONTACTNAME_FIELD.fieldApiName] = this.contactName;//set contact name
    fields_Contact[CONTACTFIRSTNAME_FIELD.fieldApiName] = this.contactFirstName;
    fields_Contact[CONTACTEMAIL_FIELD.fieldApiName] = this.contactEmailId;
 fields_Contact[CONTACTPHONENUMBER_FIELD.fieldApiName] = this.conatctPhoneNumber;
    fields_Contact[CONTACTACCOUNTID_FIELD.fieldApiName] = this.accountRecordId;//set parent account
    const contRecordInput = { apiName: CONTACT_OBJECT.objectApiName,
      fields : fields_Contact};
         //create contact
         createRecord(contRecordInput)
         .then(contact =>{
             this.contactRecordId= contact.id;
             this.dispatchEvent(
                 new ShowToastEvent({
                  title: 'Success',
                  message: 'Contact created',
                  variant: 'success',
                 }),
             );
         
          })
          .catch(error => {
              this.dispatchEvent(
                  new ShowToastEvent({
                      title: 'Error creating record',
                      message: error.body.message,
                      variant: 'error',
                  }),
              );
          });
  })

}






          
else if((this.template.querySelector(".accountRadioCreationClass").checked) && (this.template.querySelector(".contactRadioCreationClass").checked) && (this.template.querySelector(".firstRadioOpportunitycls").checked))
{


///alert('hiiiii');
   
             const fields = {};
            fields[NAME_FIELD.fieldApiName] = this.accountName;
            const accRecordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
            // create account record
            createRecord(accRecordInput)
                .then(account => {
                    this.accountRecordId = account.id;
                    this.acccreated=true;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Account created with id'+this.accountRecordId,
                            variant: 'success',
                        }),
                    );
                
              //create related contact
             const fields_Contact = {};
              fields_Contact[CONTACTNAME_FIELD.fieldApiName] = this.contactName;//set contact name
              fields_Contact[CONTACTFIRSTNAME_FIELD.fieldApiName] = this.contactFirstName;
              fields_Contact[CONTACTEMAIL_FIELD.fieldApiName] = this.contactEmailId;
              fields_Contact[CONTACTPHONENUMBER_FIELD.fieldApiName] = this.conatctPhoneNumber;
              fields_Contact[CONTACTACCOUNTID_FIELD.fieldApiName] = this.accountRecordId;//set parent account
              const contRecordInput = { apiName: CONTACT_OBJECT.objectApiName,
                fields : fields_Contact};
                   //create contact
                   createRecord(contRecordInput)
                   .then(contact =>{
                       this.contactRecordId= contact.id;
                       this.dispatchEvent(
                           new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact created',
                            variant: 'success',
                           }),
                       );
                   
                       const fields_Opportunity  = {};
                       fields_Opportunity [OPPORTUNITYNAME_FIELD.fieldApiName] = this.opportunityName;
                       fields_Opportunity [STAGE_FIELD.fieldApiName] = this.opportunityStage;
                       fields_Opportunity [CLOSEDATE_FIELD.fieldApiName] =  this.opportunityCloseDate;
                       fields_Opportunity [ACCOUNTOPPORTUNITYID_FIELD.fieldApiName] = this.accountRecordId;
                       fields_Opportunity [PROBABILITY_FIELD.fieldApiName] = this.opportunityprobability;
                       const recordInput = { apiName: OPPORTUNITY_OBJECT.objectApiName, fields : fields_Opportunity };
                       
                           createRecord(recordInput)
                               .then(oppportunity => {
                                   this.opportunityId = oppportunity.id;
                                   this.dispatchEvent(
                                       new ShowToastEvent({
                                           title: 'Success',
                                           message: 'Opportunity created with id '+ this.opportunityId,
                                           variant: 'success',
                                       }),
                                   );
                               })
    
          
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error',
                        }),
                    );
                });
        })
    
        }
    else if((this.template.querySelector(".accountRadioCreationClass").checked) && (this.template.querySelector(".contactRadioSelectionClass").checked) && (this.template.querySelector(".firstRadioOpportunitycls").checked))
        {      const fields = {};
            fields[NAME_FIELD.fieldApiName] = this.accountName;
            const accRecordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };
            // create account record
            createRecord(accRecordInput)
                .then(account => {
                    this.accountRecordId = account.id;
                    this.acccreated=true;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Account created with id'+this.accountRecordId,
                            variant: 'success',
                        }),
                    );
              //update contact record
              let record = {
                fields: {
                    Id: this.contactRecordId,
                  // LastName:this.contactName,
                  // Phone:this.conatctPhoneNumber,
                  // Email:this.contactEmailId,
                   AccountId:this.accountRecordId
                },
            };
        updateRecord(record)
            .then(()=> {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Conatct with'+  this.contactRecordId  +'     has been updated successfully.',
                        variant: 'success',
                    }),
                );
               
                //create opportunity record
                const fields_Opportunity  = {};
                fields_Opportunity [OPPORTUNITYNAME_FIELD.fieldApiName] = this.opportunityName;
                fields_Opportunity [STAGE_FIELD.fieldApiName] = this.opportunityStage;
                fields_Opportunity [CLOSEDATE_FIELD.fieldApiName] =  this.opportunityCloseDate;
                fields_Opportunity [ACCOUNTOPPORTUNITYID_FIELD.fieldApiName] = this.accountRecordId;
                fields_Opportunity [PROBABILITY_FIELD.fieldApiName] = this.opportunityprobability;
                const opprecordInput = { apiName: OPPORTUNITY_OBJECT.objectApiName, fields : fields_Opportunity };
                
                    createRecord(opprecordInput)
                        .then(oppportunity => {
                            this.opportunityId = oppportunity.id;
                            this.dispatchEvent(
                                new ShowToastEvent({
                                    title: 'Success',
                                    message: 'Opportunity created with id '+ this.opportunityId,
                                    variant: 'success',
                                }),
                            );
                        })

   
                   })
                     .catch(error => {
                             this.dispatchEvent(
                               new ShowToastEvent({
                                  title: 'Error creating record',
                                  message: error.body.message,
                                  variant: 'error',
                   }),
                  );
               });
 


            })

        }
       
else if((this.template.querySelector(".accountRadioSelectionClass").checked) && (this.template.querySelector(".contactRadioCreationClass").checked) && (this.template.querySelector(".firstRadioOpportunitycls").checked))
{   

               
        //update account
        let record = {
            fields: {
                Id: this.accountRecordId,
               Name: this.accountName
            },
        };

        updateRecord(record)
        .then(()=> {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account with'+  this.accountRecordId  +'     has been updated successfully.',
                    variant: 'success',
                }),
            );

        //create contact

        const fields_Contact = {};
        fields_Contact[CONTACTNAME_FIELD.fieldApiName] = this.contactName;//set contact name
        fields_Contact[CONTACTFIRSTNAME_FIELD.fieldApiName] = this.contactFirstName;
        fields_Contact[CONTACTEMAIL_FIELD.fieldApiName] = this.contactEmailId;
        fields_Contact[CONTACTPHONENUMBER_FIELD.fieldApiName] = this.conatctPhoneNumber;
        fields_Contact[CONTACTACCOUNTID_FIELD.fieldApiName] = this.accountRecordId;//set parent account
        const contRecordInput = { apiName: CONTACT_OBJECT.objectApiName,
          fields : fields_Contact};
             //create contact
             createRecord(contRecordInput)
             .then(contact =>{
                 this.contactRecordId= contact.id;
                 this.dispatchEvent(
                     new ShowToastEvent({
                      title: 'Success',
                      message: 'Contact created',
                      variant: 'success',
                     }),
                 );
          //create Opportunity
          
          const fields_Opportunity  = {};
                       fields_Opportunity [OPPORTUNITYNAME_FIELD.fieldApiName] = this.opportunityName;
                       fields_Opportunity [STAGE_FIELD.fieldApiName] = this.opportunityStage;
                       fields_Opportunity [CLOSEDATE_FIELD.fieldApiName] =  this.opportunityCloseDate;
                       fields_Opportunity [ACCOUNTOPPORTUNITYID_FIELD.fieldApiName] = this.accountRecordId;
                       fields_Opportunity [PROBABILITY_FIELD.fieldApiName] = this.opportunityprobability;
                       const recordInput = { apiName: OPPORTUNITY_OBJECT.objectApiName, fields : fields_Opportunity };
                       
                           createRecord(recordInput)
                               .then(oppportunity => {
                                   this.opportunityId = oppportunity.id;
                                   this.dispatchEvent(
                                       new ShowToastEvent({
                                           title: 'Success',
                                           message: 'Opportunity created with id '+ this.opportunityId,
                                           variant: 'success',
                                       }),
                                   );
                               })
    
          
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error',
                        }),
                    );
                });
        })

}


else if((this.template.querySelector(".accountRadioSelectionClass").checked) && (this.template.querySelector(".contactRadioCreationClass").checked) && (this.template.querySelector(".secondRadioOpportunitycls").checked))
{
    
                        //update account
                    let record = {
                                 fields: {
                                      Id: this.accountRecordId,
                                     Name: this.accountName
                                                 },
                                                };

                            updateRecord(record)
                                .then(()=> {
                                    this.dispatchEvent(
                                      new ShowToastEvent({
                                        title: 'Success',
                                       message: 'Account with'+  this.accountRecordId  +'     has been updated successfully.',
                                     variant: 'success',
                                }),
                                             );

                    //create contact
                    const fields_Contact = {};
                    fields_Contact[CONTACTNAME_FIELD.fieldApiName] = this.contactName;//set contact name
                    fields_Contact[CONTACTFIRSTNAME_FIELD.fieldApiName] = this.contactFirstName;
                    fields_Contact[CONTACTEMAIL_FIELD.fieldApiName] = this.contactEmailId;
                    fields_Contact[CONTACTPHONENUMBER_FIELD.fieldApiName] = this.conatctPhoneNumber;
                    fields_Contact[CONTACTACCOUNTID_FIELD.fieldApiName] = this.accountRecordId;//set parent account
                const contRecordInput = { apiName: CONTACT_OBJECT.objectApiName,
                            fields : fields_Contact};
                                        //create contact
                                 createRecord(contRecordInput)
                                 .then(contact =>{
                                     this.contactRecordId= contact.id;
                                    this.dispatchEvent(
                                     new ShowToastEvent({
                                             title: 'Success',
                                             message: 'Contact created',
                                             variant: 'success',
                                     }),
                                     );
                   //update Opportnity 

                   let opportunityUpdatingRecord = {
                    fields: {
                         Id: this.opportunitySelectedValue,
                        AccountId__c: this.accountRecordId
                                    },
                                   };

               updateRecord(opportunityUpdatingRecord)
                   .then(()=> {
                       this.dispatchEvent(
                         new ShowToastEvent({
                           title: 'Success',
                          message: 'Opportnity with'+  this.opportunitySelectedValue +'     has been updated successfully.',
                        variant: 'success',
                   }),
                                );

                            })
    
          
                        })
                        .catch(error => {
                            this.dispatchEvent(
                                new ShowToastEvent({
                                    title: 'Error creating record',
                                    message: error.body.message,
                                    variant: 'error',
                                }),
                            );
                        });
                })
                    
}

else if((this.template.querySelector(".accountRadioSelectionClass").checked) && (this.template.querySelector(".contactRadioSelectionClass").checked) && (this.template.querySelector(".secondRadioOpportunitycls").checked))
{

                    //update account
                                let record = {
                                 fields: {
                                      Id: this.accountRecordId,
                                     Name: this.accountName
                                                 },
                                                };

                            updateRecord(record)
                                .then(()=> {
                                    this.dispatchEvent(
                                      new ShowToastEvent({
                                        title: 'Success',
                                       message: 'Account with'+  this.accountRecordId  +'     has been updated successfully.',
                                     variant: 'success',
                                }),
                                             );

                           //update contact record
                    let record = {
                       fields: {
                         Id: this.contactRecordId,
                      //  LastName:this.contactName,
                      //  Phone:this.conatctPhoneNumber,
                      //  Email:this.contactEmailId,
                       AccountId:this.accountRecordId
                         },
                          };
                    updateRecord(record)
                        .then(()=> {
                          this.dispatchEvent(
                            new ShowToastEvent({
                                  title: 'Success',
                            message: 'Conatct with'+  this.contactRecordId  +'     has been updated successfully.',
                             variant: 'success',
                          }),
                          );

                    //update Opportnity 

                   let opportunityUpdatingRecord = {
                    fields: {
                         Id: this.opportunitySelectedValue,
                        AccountId__c: this.accountRecordId
                                    },
                                   };

               updateRecord(opportunityUpdatingRecord)
                   .then(()=> {
                       this.dispatchEvent(
                         new ShowToastEvent({
                           title: 'Success',
                          message: 'Opportnity with'+  this.opportunitySelectedValue +'     has been updated successfully.',
                        variant: 'success',
                   }),
                                );

                            })
    
          
                        })
                        .catch(error => {
                            this.dispatchEvent(
                                new ShowToastEvent({
                                    title: 'Error creating record',
                                    message: error.body.message,
                                    variant: 'error',
                                }),
                            );
                        });
                })
}


else if((this.template.querySelector(".accountRadioSelectionClass").checked) && (this.template.querySelector(".contactRadioSelectionClass").checked) && (this.template.querySelector(".firstRadioOpportunitycls").checked))
{

                                    //update account
                                let record = {
                                    fields: {
                                         Id: this.accountRecordId,
                                        Name: this.accountName
                                                    },
                                                   };
   
                               updateRecord(record)
                                   .then(()=> {
                                       this.dispatchEvent(
                                         new ShowToastEvent({
                                           title: 'Success',
                                          message: 'Account with'+  this.accountRecordId  +'     has been updated successfully.',
                                        variant: 'success',
                                   }),
                                                );
   
                              //update contact record
                       let record = {
                          fields: {
                            Id: this.contactRecordId,
                         //  LastName:this.contactName,
                          // Phone:this.conatctPhoneNumber,
                          // Email:this.contactEmailId,
                          AccountId:this.accountRecordId
                            },
                             };
                       updateRecord(record)
                           .then(()=> {
                             this.dispatchEvent(
                               new ShowToastEvent({
                                     title: 'Success',
                               message: 'Conatct with'+  this.contactRecordId  +'     has been updated successfully.',
                                variant: 'success',
                             }),
                             );
   
                           //create Opportunity
          
          const fields_Opportunity  = {};
          fields_Opportunity [OPPORTUNITYNAME_FIELD.fieldApiName] = this.opportunityName;
          fields_Opportunity [STAGE_FIELD.fieldApiName] = this.opportunityStage;
          fields_Opportunity [CLOSEDATE_FIELD.fieldApiName] =  this.opportunityCloseDate;
          fields_Opportunity [ACCOUNTOPPORTUNITYID_FIELD.fieldApiName] = this.accountRecordId;
          fields_Opportunity [PROBABILITY_FIELD.fieldApiName] = this.opportunityprobability;
          const recordInput = { apiName: OPPORTUNITY_OBJECT.objectApiName, fields : fields_Opportunity };
          
              createRecord(recordInput)
                  .then(oppportunity => {
                      this.opportunityId = oppportunity.id;
                      this.dispatchEvent(
                          new ShowToastEvent({
                              title: 'Success',
                              message: 'Opportunity created with id '+ this.opportunityId,
                              variant: 'success',
                          }),
                      );
                      })


                   })
                 .catch(error => {
                    this.dispatchEvent(
                      new ShowToastEvent({
                   title: 'Error creating record',
                message: error.body.message,
               variant: 'error',
                     }),
                    );
                   });
                })

}
 

//  this.closeQuickAction();
setTimeout(()=>{
   // alert('holaaaaa');
    this.navigateToAccountPage();
},1000);
       }
 
    }
    closeQuickAction() {
      
        const closeQA = new CustomEvent('close');
        // Dispatches the event.
        this.dispatchEvent(closeQA);
    }
     
}