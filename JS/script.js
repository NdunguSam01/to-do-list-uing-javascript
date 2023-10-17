document.addEventListener("DOMContentLoaded", ()=>
{
    fetchToDos() //Invoking the function responsible for fetching the data from the JSON server
    addToDo()//Invoking the function that will handle the form submission
})

const fetchToDos= ()=>
{
    fetch("http://localhost:3000/toDos")
        .then(response=> response.json())
        .then(toDos=>
            {
                toDos.forEach(toDo => 
                {
                    let {id, title, completed} = toDo
                    renderToDos(id, title, completed)
                });
            })
}

//Declaring the function that will be used to fetch the list from the JSON server
const renderToDos=(id, title, completed)=>
{
    //Getting the parent element where the data will be appended to
    let parentList = document.getElementById("to-Do-List")
    
    //Creating the elements to be rendered to the DOM
    let toDoItem= document.createElement("li")

    if(completed===true)
    {
        toDoItem.innerHTML=
        `
        <span style="text-decoration: line-through;">${title}</span>
        <i class="fa fa-check" id="${id}"  title="Mark as done"></i>
        <i class="fa fa-trash-o" id="${id}" title="Delete task"></i>
        `
    }
    else
    {
        toDoItem.innerHTML=
        `
        <span>${title}</span>
        <i class="fa fa-check" id="${id}" title="Mark as done"></i>
        <i class="fa fa-trash-o" id="${id}" title="Delete task"></i>
        `
    }

    //Setting the id of the created list item
    toDoItem.setAttribute("id",id)

    //Getting the done and delete buttons
    let doneBtns=toDoItem.querySelectorAll(".fa-check")
    let deleteBtns=toDoItem.querySelectorAll(".fa-trash-o")

    //Looping over the buttons to add an event listener to the individual items
    doneBtns.forEach(doneBtn => 
    {
        doneBtn.addEventListener("click",()=>
        {
            let updatedToDoObject=
            {
                completed: true
            }
            //Passing the object and ID as parameters to the function that will handle the update functionality
            updatedToDo(updatedToDoObject, doneBtn.id)
        })
    });

    deleteBtns.forEach(deleteBtn => 
    {
        deleteBtn.addEventListener("click", ()=>
        {
             //Passing the ID as parameter to the function that will handle the delete functionality
            deleteToDo(deleteBtn.id)
        }) 
    });

    //Appending the created list item to the parent element
    parentList.appendChild(toDoItem)
}

//Declaring the function that will handle the form submission 
const addToDo=()=>
{
    //Grabbing the from from the DOM and adding an submit event listener to it
    const form=document.querySelector("form")

    form.addEventListener("submit", e =>
    {
        //Preventing page from reloading once data is submitted
        e.preventDefault()


        //Getting the value entered by the user 
        let toDo=document.getElementById("new-toDo")

        //Creating an object that will be used to add the information entered by the user to the JSON server
        let toDoObject=
        {
            title: toDo.value,
            completed: false
        }

        //Invoking the function that will add the new to do task to the JSON server
        addToDotoJSON(toDoObject)

        //Resseting the form after submission
        form.reset()
    })
}

//Function that adds the data submitted by the user to the server
const addToDotoJSON=toDoObject=>
{
    fetch("http://localhost:3000/toDos", 
    {
        method: "POST",
        headers: 
        {
            'Content-type' : 'application/json'
        },
        //Converting the object to a JSON string
        body: JSON.stringify(toDoObject)
    })
}

const updatedToDo=(updatedToDoObject, id)=>
{

    //Updating the value of completed based in the ID
    fetch(`http://127.0.0.1:3000/toDos/${id}`,
    {
        method: "PATCH",
        headers: 
        {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(updatedToDoObject)
    })
}

//Declaring a function to handle deleting of the to do tasks
const deleteToDo=(id)=>
{
    //Fetching the data to be deleted using its ID
    fetch(`http://127.0.0.1:3000/toDos/${id}`, 
    {
        method: "DELETE",
        headers: 
        {
            'Content-type' : 'application/json'
        }
    })
}