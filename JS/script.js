document.addEventListener("DOMContentLoaded", ()=>
{
    fetchToDosFromServer() //Invoking the function responsible for fetching the data from the JSON server
    addToDo()//Invoking the function that will handle the form submission
})

//Function to fetch the data from the JSON server
const fetchToDosFromServer= ()=>
{
    fetch("http://localhost:3000/toDos")
        .then(response=> response.json())
        .then(toDos=>
            {
                toDos.forEach(toDo => 
                {
                    let {id, title, completed} = toDo //Destructuring the data inside the array
                    renderToDos(id, title, completed)//Passing the destructured data as arguments to the function that will add the items to the DOM
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

    //Setting the innerHTML based on when the completed attribute is true or not.
    //If true, the to do item will be strike through. Else it will appear as normal
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
            //Creating the object that will be passed in as the body when doing a PATCH request
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
            //Passing the ID as parameter to the function that will handle the delete functionality. The ID will be used to delete that specific item
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
    //Setting the URL
    const fetchURL="http://localhost:3000/toDos"

    //Specifying the HTTP verb to be used
    const addConfiguration=
    {
        method: "POST",
        headers: 
        {
            'Content-type' : 'application/json'
        },
        //Converting the object to a JSON string
        body: JSON.stringify(toDoObject)
    }

    //Invoking the function that will handle the POST
    crudFunction(fetchURL, addConfiguration)
}

const updatedToDo=(updatedToDoObject, id)=>
{
    //Setting the URL
    const updateURL=`http://127.0.0.1:3000/toDos/${id}`

    //Specifying the HTTP verb to be used
    const updateConfiguration=
    {
        method: "PATCH",
        headers: 
        {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(updatedToDoObject)
    }

    //Invoking the function that will handle the PATCH
    crudFunction(updateURL, updateConfiguration)
}

//Declaring a function to handle deleting of the to do tasks
const deleteToDo=(id)=>
{
    //Setting the URL
    const deleteURL=`http://127.0.0.1:3000/toDos/${id}`

    //Specifying the HTTP verb to be used
    const deleteConfiguration=
    {
        method: "DELETE",
        headers: 
        {
            'Content-type' : 'application/json'
        }
    }

    //Invoking the function that will handle the delete
    crudFunction(deleteURL, deleteConfiguration)
}

//Creating a function that will be called for various HTTP verb methods. Helps avoid repeating same bit of code
const crudFunction=(url, configurationObject)=>
{
    fetch(url, configurationObject)
}