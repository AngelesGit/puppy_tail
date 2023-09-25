import React from "react";
import { useEffect, useContext , useState} from "react";
import { Context } from "../store/appContext";
import "../../styles/profile.css"
import stock_pet from "../../img/stock_pet_black.png"


export const Pets = (props) => {
    const{ store, actions } = useContext(Context);
    const [edit, setEdit] = useState(false);
    const [currentPet, setPet] = useState({})
    const [preview, setPreview] = useState(stock_pet)

    function imgErrorHandler(e){
        e.target.src = stock_pet
    }

    async function createPet(){
        let newPet = {
            "name": document.getElementById('newPetNameInput').value, 
            "size":document.getElementById('newPetSizeInput').value, 
            "category": document.getElementById('newPetCategoryInput').value,
            "owner_id": store.currentUser.id
        }
        await actions.createPet(newPet).then(data=>console.log(data.id))
        // if (preview != stock_pet){
        //     const formData = new FormData()
        //     formData.append("avatar",document.getElementById("petImg").files[0])
        //     let resp = await actions.uploadpetAvatar(formData, data.id)
        //     resp = Object.assign(resp, {"profile_pic":resp.public_url})
        //     console.log(resp)
        //     actions.updatePet(resp)
        // }
    }

    async function updatePet(){
        if (preview != stock_pet){
            const formData = new FormData()
            formData.append("avatar",document.getElementById("petImg").files[0])
            let resp = await actions.uploadpetAvatar(formData, currentPet.id)
            currentPet["profile_pic"] = resp.public_url
        }
        let updatedPet = {
            "id":currentPet.id.toString(), 
            "name": document.getElementById('nameInput').value, 
            "size":document.getElementById('sizeInput').value, 
            "category": document.getElementById('categoryInput').value,
            "owner_id": currentPet.owner_id.toString(),
            "profile_pic": currentPet.profile_pic
        }
        actions.updatePet(updatedPet)
    }

    useEffect(()=>{
        //actions.getOwner(1);
    },[]);
    return(
        <div className="text-left my-2">
            <div className="d-flex flex-row justify-content-between align-items-center mb-2">
                <h2 style={{textAlign: "left", alignItems:"center"}}><strong>Mis mascotas</strong></h2>
                <button onClick={()=>setEdit(!edit)} className="btn btn-outline-dark">Editar</button>
            </div>
            {/* Lista de mascotas */}
            <ul className="p-0 d-flex flex-row flex-wrap justify-content-start align-items-center gap-4">
            {(store.pets.length < 1? "":store.pets.map((pet, index)=>{
            return (
                <div style={{width: "12rem"}} key={index}>
                    <div style={{borderRadius:"50%", width: "100%", height:"auto", overflow:"hidden", aspectRatio:"1"}}><img onError={imgErrorHandler}  src={pet.profile_pic} className="card-img-top" alt="..." /></div>
                    <div className="card-body">
                        <h5 className="card-title">{pet.name}</h5>
                        <div className="card-text">
                            <p>{pet.category}<br />{pet.size}</p>
                        </div>
                        {/* Operacion ternaria para mostrar botones de editar */}
                        {(edit==false?"":<div className="d-flex flex-row justify-content-center gap-3">
                            <button type="button" className="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#editPet" onClick={()=>setPet(pet)}>Editar</button>
                            {/* <!-- Modal --> */}
                            <div className="modal fade" id="editPet" tabIndex="-1" aria-labelledby="editPetLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="editPetLabel">Editar {currentPet.name}</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>setPreview(stock_pet)}></button>
                                        </div>
                                    <div className="modal-body textLeft">
                                        {/* FORM BODY */}
                                        <form>
                                            <div className="mb-3">
                                                <div className="d-flex align-items-center justify-content-center"  style={{width: "100%", height:"12rem",overflow:"hidden", aspectRatio:"1"}}>
                                                    <img onError={imgErrorHandler} style={{borderRadius:"50%", width:"12rem", height:"auto"}} src={preview}></img>
                                                </div>
                                            </div>
                                            <div className="text-center mb-3">
                                                <input type="file" name="avatar" id="petImg" onChange={(event)=>setPreview(URL.createObjectURL(event.target.files[0]))} hidden/>
                                                <label className="btn btn-outline-dark" htmlFor="petImg">Seleccionar foto</label>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="nameInput" className="form-label">Nombre</label>
                                                <input type="text" className="form-control" id="nameInput" aria-describedby="nameHelp" defaultValue={currentPet.name}/>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="sizeInput" className="form-label">Tamaño</label>
                                                <select className="form-select" aria-label="Default select example" id="sizeInput" defaultValue={currentPet.size}>
                                                    <option value="Pequeño">Pequeño (1-8kg)</option>
                                                    <option value="Mediano">Mediano (8-20kg)</option>
                                                    <option value="Grande">Grande (20-30kg)</option>
                                                    <option value="Extra Grande">Extra Grande (30+kg)</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="categoryInput" className="form-label">Raza</label>
                                                <input type="text" className="form-control" id="categoryInput" defaultValue={currentPet.category}/>
                                            </div>
                                        </form>
                                        {/* END OF FORM BODY */}
                                    </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-outline-dark" data-bs-dismiss="modal" onClick={()=>setPreview(stock_pet)}>Cancelar</button>
                                            <button type="submit" onClick={updatePet} className="btn btn-outline-success" data-bs-dismiss="modal">Guardar cambios</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Fin de modal */}

                            {/* <!-- Button trigger modal --> */}
                            <button type="button" onClick={()=>setPet(pet)} className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i className="fa-solid fa-trash"></i>
                            </button>
                            {/* <!-- Modal --> */}
                            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Eliminar {currentPet.name}</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                    <div className="modal-body">
                                       Estas seguro que quieres eliminar a {currentPet.name} de tu perfil?
                                    </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-outline-dark" data-bs-dismiss="modal">Cancelar</button>
                                            <button type="button" onClick={()=>actions.deletePet(currentPet)} className="btn btn-outline-danger" data-bs-dismiss="modal">Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Fin de modal */}
                        </div>)}
                        {/* Fin de botones de editar */}
                    </div>
                </div>
                );
            }))}
                <div className="px-4">
                    <div className="d-flex flex-column align-items-center text-center gap-4">
                        <button className="btn btn-outline-dark rounded-circle" data-bs-toggle="modal" data-bs-target="#addPet" style={{aspectRatio:"1", width:"5rem", height:"5rem", fontSize:"42px", paddingTop:"0"}}>+</button>
                        <h5><strong>Agregar mascota</strong></h5>
                        {/* <!-- Modal --> */}
                        <div className="modal fade" id="addPet" tabIndex="-1" aria-labelledby="addPetLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="addPetLabel">Agregar mascota</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=>setPreview(stock_pet)}></button>
                                        </div>
                                    <div className="modal-body textLeft">
                                        {/* FORM BODY */}
                                        <form>
                                            <div className="mb-3">
                                                <div className="d-flex align-items-center justify-content-center"  style={{width: "100%", height:"12rem",overflow:"hidden", aspectRatio:"1"}}>
                                                    <img onError={imgErrorHandler} style={{borderRadius:"50%", width:"12rem", height:"auto"}} src={preview}></img>
                                                </div>
                                            </div>
                                            <div className="text-center mb-3">
                                                <input type="file" name="avatar" id="petImg" onChange={(event)=>setPreview(URL.createObjectURL(event.target.files[0]))} hidden/>
                                                <label className="btn btn-outline-dark" htmlFor="petImg">Seleccionar foto</label>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="newPetNameInput" className="form-label">Nombre</label>
                                                <input type="text" className="form-control" id="newPetNameInput" aria-describedby="nameHelp"/>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="newPetSizeInput" className="form-label">Tamaño</label>
                                                <select className="form-select" aria-label="Size by kilograms" id="newPetSizeInput">
                                                    {/* <option selected>{currentPet.size}</option> */}
                                                    <option value="Pequeño">Pequeño (1-8kg)</option>
                                                    <option value="Mediano">Mediano (8-20kg)</option>
                                                    <option value="Grande">Grande (20-30kg)</option>
                                                    <option value="Extra Grande">Extra Grande (40kg+)</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="newPetCategoryInput" className="form-label">Raza</label>
                                                <input type="text" className="form-control" id="newPetCategoryInput"/>
                                            </div>
                                        </form>
                                        {/* END OF FORM BODY */}
                                    </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-outline-dark" data-bs-dismiss="modal" onClick={()=>setPreview(stock_pet)}>Cancelar</button>
                                            <button type="submit" onClick={createPet} className="btn btn-outline-success" data-bs-dismiss="modal">Agregar mascota</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Fin de modal */}
                    </div>
                </div>
            </ul>
        </div>
    );
}