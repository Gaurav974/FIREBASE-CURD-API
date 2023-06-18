
const cl = console.log;

const formcontainer =document.getElementById('formcontainer'),
cardcontainer=document.getElementById('cardcontainer'),
contentcontrol=document.getElementById('content'),
titlecontrol=document.getElementById('title'),
updateBtn =document.getElementById('updatebtn'),
submitbtn =document.getElementById('submitbtn');
 let baseUrl = `https://friebase-api-default-rtdb.firebaseio.com/`;
 let postUrl = `${baseUrl}posts.json`;
 
const makeApiCall =(method,userurl,body)=>{
     return new Promise((resolve, reject) => {
        let xhr =new XMLHttpRequest ;
        xhr.open(method , userurl)
        xhr.onload =function(){
            if(xhr.status >= 200 || xhr.status <= 300 ){
                resolve(xhr.response)
            }else{
                reject(`somthing Went wrong`)
            }
        }
        xhr.send(JSON.stringify(body))
     })
    
}


function templating(array){
    let result =''
    array.forEach(ele => {
       result+=
       `
                   <div class="card" id="${ele.id}">
                       <div class="card-header">
                          <h3> ${ele.title}</h3>
                       </div>
                       <div class="card-body">
                          <p> ${ele.content}</p>
                       </div>
                       <div class="card-footer text-right">
                       <button class="btn btn-info" onclick="onEdited(this)">Edit</button>
                       <button class="btn btn-info" onclick="onDelete(this)">Delete</button>
                       </div>
                   </div>
       
       `
    });
    cardcontainer.innerHTML =result
}
makeApiCall("GET" , postUrl)
   .then( res =>{
    let data =JSON.parse(res)
    let arr =[]

    for (const key in data) {
      let obj ={
        id : key,
        ...data[key]
      }
        arr.push(obj)
    } 
    templating(arr)
   })
   .catch( rej =>{
    cl(rej)
   })
const OnsubmitHandler =(eve)=>{
    eve.preventDefault()
    cl(`hi`)
    let obj ={
        title: titlecontrol.value,
        content : contentcontrol.value
    }
    makeApiCall("POST" ,postUrl , obj)
      .then( res =>{
        let datas =JSON.parse(res);
        let  card =document.createElement("div");
        card.id =datas.name;
        card.className ="card my-2";
        let result = 
            ` 
                <div class="card-header">
                   <h3> ${obj.title}</h3>
                </div>
                <div class="card-body">
                   <p> ${obj.content}</p>
                </div>
                <div class="card-footer text-right">
                    <button class="btn btn-info" onclick="onEdited(this)">Edit</button>
                    <button class="btn btn-info" onclick="onDelete(this)">Delete</button>
                </div>

                `
        card.innerHTML = result;
        cardcontainer.prepend(card)
      })
      .catch( rej =>{
        cl(rej)
      })
      .finally(fin =>{
        eve.target.reset()
      })
     

}
const  onEdited =(ele) =>{
    let edited =ele.closest('.card').getAttribute(`id`)
    localStorage.setItem("editedid" ,edited)

    let editedurl =`${baseUrl}posts/${edited}.json`
    cl(editedurl)
    makeApiCall("GET" , editedurl)
        .then( res=>{
          let meta = JSON.parse(res)
          titlecontrol.value =meta.title
          contentcontrol.value =meta.content
        })
        updateBtn.classList.remove('d-none')
        submitbtn.classList.add('d-none')
}
const UpdatePosthandler =() =>{
   let updateid =localStorage.getItem('editedid')
   let updateurl =`${baseUrl}posts/${updateid}.json`
   cl(updateurl)
   let obj ={
    title: titlecontrol.value,
    content : contentcontrol.value
   }
  makeApiCall("PATCH" , updateurl , obj)
    .then(res =>{
          let metas =JSON.stringify(res)
         const updatedid =[...document.getElementById(updateid).children];
         updatedid[0].innerHTML = ` <h3> ${obj.title}</h3>`;
         updatedid[1].innerHTML = ` <p> ${obj.content}</p>`;

    })
    .catch(cl)
    submitbtn.classList.remove('d-none')
    updateBtn.classList.add('d-none')
    
} 
const onDelete =(ele)=>{
    let ondelete =ele.closest('.card').id;
    let  updateUrl =`${baseUrl}posts/${ondelete}.json`
    makeApiCall("DELETE" ,updateUrl)
       .then(res =>{
        let deleted =document.getElementById(ondelete)
        deleted.remove()
       })
       .catch(cl)
}
formcontainer.addEventListener("submit" , OnsubmitHandler)
updateBtn.addEventListener("click" , UpdatePosthandler)
