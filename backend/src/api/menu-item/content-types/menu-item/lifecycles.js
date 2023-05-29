module.exports={
    beforeCreate(event){
        event.params.data.category = event.params.data.categoryId
    }
}