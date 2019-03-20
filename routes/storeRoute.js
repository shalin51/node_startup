const express=require('express');
const storeRoutes = express.Router();
const Store=require('../modals/store');



storeRoutes.get('/all',async(req,res)=>{
    try {
        const {store_id}=req.session;
        let store=new Store();
        let stores=await store.getStore();       
        res.status(200).send(stores);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});



storeRoutes.post('/profile',async(req,res)=>{
    try {        
        const {pass,email}=req.body;
        let store=new Store();
        let storeResult=await store.getStore(email,pass);  
        const {_id,name}=storeResult;
        req.session.store={email,store_id:_id,name}; 
        res.status(200).send(storeResult);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


storeRoutes.get('/info',async(req,res)=>{
    try {
        
        const {store_id}=req.session.store;                
        if(store_id){
            let store=new Store();
            let stores=await store.getStoreInfo({_id:store_id});       
            res.status(200).send(stores);
        }else{
            res.status(401).send("Please Login");
        }      
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

storeRoutes.post('/add',async(req,res)=>{
    try {        
        const {store}=req.body;              
        const {name}=store;
        let storeObj=new Store();         
        const store_id=await storeObj.addStore(store);   
        req.session.store={name,store_id}; //analytics id and store id is same
        res.status(200).send("Store added with id:"+store_id);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

storeRoutes.patch('/searches',async(req,res)=>{
    try {
        const {store_id}=req.session;
        let store=new Store();
        store.updateSearches();
        res.status(200).send("search updated");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


storeRoutes.patch('/locations',async(req,res)=>{
    try {
        const {store_id}=req.session;
        const {location}=req.body;
        let store=new Store();      
        store.updateLocation(location);
        res.status(200).send("Location updated");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

storeRoutes.patch('/deviceid',async(req,res)=>{
    try {
        const {store_id}=req.session;
        const {device_id}=req.body;
        let store=new Store(store_id);      
        store.updateLocation(device_id);
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});


module.exports=storeRoutes;
