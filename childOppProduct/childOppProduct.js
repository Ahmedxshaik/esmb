import { LightningElement, wire,track,api} from 'lwc';
import getAllPricebooks from '@salesforce/apex/PricebookController.getAllPricebooks';
import deleteAllOppline from '@salesforce/apex/PricebookController.deleteAllOppline';
import { updecord } from 'lightning/uiRecordApi';
import updateOppPricebook from '@salesforce/apex/PricebookController.updateOppPricebook';


export default class LightningDatatableExample extends LightningElement {
    @track openmodels = true;
    @track items = []; //this holds the array for records with value & label
    @track error;
    @track value='';
    @api pricebookId;
    @api sesval;
    @track delclosemodel=false;
    @track disablevar=true;
    @api dels;
    @api price;
    @track sameval= false;
    @track aval=false;
    @api recordId;
    @api opprecord;
    get options() 
    {
        return [
                 { label: 'Choose Price Book', value: 'Choose Price Book' },
                
                 { label: 'Add products', value: 'Add products' },
               ];
    }
    
    
    @wire(getAllPricebooks)
    pricebookList({error, data})
    {
      if(data)
      {
        var i;
        for(i=0; i<data.length; i++) 
        {
         this.items = [...this.items,{value: data[i].Id , label: data[i].Name}];                                   
        }                
        this.error = undefined;
      }
      else if(error)
      {
          this.error=error;
      }
    }

    get pricebookOptions()
    {
     
        return this.items;
    }
  
    pricebookChange(event) 
    {
      this.sameval=false;
        this.pricebookId = event.detail.value;
      //  sessionStorage.setItem('myValueToPassThrough', pricebookId);
      
      if(this.price == this.pricebookId)
      {
        this.sameval=true;
        this.disablevar=true;
      }
      else if(this.pricebookId != null)
      {
        this.disablevar=false;
        this.aval=false;
      }
  }


    deleteecord()
    {
      if(this.price !=  this.pricebookId)
      {
         deleteAllOppline({cont:this.dels,record :this.opprecord})
         .then(result => {
    
          })
         .catch(error => {
        
         this.error = error;
         });
      }
      
      //updecord({ fields: { Id: this.recordId } });
    }
    
    
    delclosemodal()
     {
       this.delclosemodel=false
       this.disablevar=true;
       this.openmodals();
       this.pricebookId=this.price;
       //this.dels=false;
       this.aval=true;
       this.savemodal();
     }
     delopenmodal()
     {
      this.closeModals();
      this.delclosemodel=true
     }
    openmodals()
    {
        this.openmodels = true  
        
    }
    closeModals()
    {
        this.openmodels = false
        
    } 


    updating()
    {
      
      updateOppPricebook({ pricebookIdapex : this.pricebookId,records:this.opprecord})  
      .then(result => {
      //this.pricebookpara=this.pricebookId;
       })
      .catch(error => {
    
      this.error = error;
       });    
       //eval("$A.get('e.force:refreshView').fire();"); 
    }


    savemodal()
    {
     
        
        console.log('resultu');
        const evt= new CustomEvent('myfirstevent', {detail:{pricebookId:this.pricebookId,openmodel:true}});
        this.dispatchEvent(evt);
       
      
        if(this.price !=  this.pricebookId)
        {
              if(this.price == null)
              {
                this.updating();
                
                
              }
              if(this.dels==true)
              {
                
                  this.delopenmodal();
              }
        }
        if(this.aval==false){
          
              this.closeModals();}
    }


    confirmModal()
    {
      
      this.dels=false;
     // this.savemodal();
      this.updating();
      this.deleteecord();
      eval("$A.get('e.force:refreshView').fire();");
      this.delclosemodel=false;
      
      
      
    }
   
  }