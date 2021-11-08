import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Modal from 'react-modal';
import MusicCarousel from '../component/Carousel';


function Home(){
    const [musicList, setMusicList] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [ID, setID] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [track, setTrack] = useState('');
    const [artist, setArtist] = useState('');

    const  search = async() =>{
        await Axios.get(`http://localhost:5000/music/${track}/${artist}`).then((response)=>{
            console.log(response.data);
            
        });
        window.location.reload();
    }

    useEffect(() => {
        Axios.get('http://localhost:5000/musicList').then((response) => {
            console.log(response.data);
            setMusicList(response.data);
        })
    }, []);

    const deleteTrack = (music) => {
        Axios.delete(`http://localhost:5000/delete_music/${music}`);
        alert('Track deleted successfully');
        window.location.reload();

    }

    const updateTrack = (id) =>{
        const newLyrics = prompt("Enter new lyrics: ");

        Axios.put(`http://localhost:5000/update/${id}`, {
            lyrics: newLyrics,
        }).then((response)=>{
            console.log(response.data);
            
        });
        window.location.reload();
    }

    

    const customStyles ={ 
        content:{
            top: '55%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
        },
    };

    const openModal = () => {
        setIsOpen(true);  
    }

    const closeModal = () =>{
        setIsOpen(false);
    }


    return(
        <div>
        <MusicCarousel />
        
        <section className="section">
            <div>
            <form className="form-inline">
                <div className="row" style={{margin: '2px 350px'}}>
                <input className="form-control mr-sm-2" type="search" placeholder="Enter Track" aria-label="Search" style={{width:'200px', paddingRight:'5px', margin:'2px 5px'}} required onChange ={(e) => {setTrack(e.target.value);}}/>
                <input className="form-control mr-sm-2" type="search" placeholder="Enter Artist" aria-label="Search" style={{width:'200px', paddingRight:'5px', margin:'2px 5px'}} required onChange ={(e) => {setArtist(e.target.value);}}/>
                <button className="btn btn-outline-success mr-sm-0" type="submit" style={{width:'200px', margin:'2px 5px'}} onClick={search}>Add</button>
                </div>
            </form>
            <hr style={{color:'white'}}/>
            </div>
            <div className="music-container">
                <h3 style={{color:'white'}}>Recently Viewed Tracks by All Users</h3>
                <div className="card">
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Track Title</th>
                                    <th>Artist</th>
                                    <th>Lyrics</th>
                                    <th>Actions</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {musicList.map((val) =>{
                                return(
                                    <tr key={val._id}> 
                                    {/*<td>{val.book_id}</td>*/}
                                    <td>{val.trackTitle}</td>
                                    <td>{val.trackArtist}</td>
                                    {/*<td>{val.lyrics}</td>*/}
                                    <td><button type="button" class="btn btn-outline-light" onClick={() => {openModal(val._id); setLyrics(val.lyrics)}}>View Lyrics</button></td>
                                    <td>
                                        <button type="button" className="btn btn-success" onClick={()=>{updateTrack(val._id)}}><span><FaEdit /></span></button>
                                        <button type="button" className="btn btn-danger" onClick={() => {deleteTrack(val._id)}}><span><FaTrashAlt /></span></button>
                                    </td>
                                    </tr>
                                );
                                })}
                                <Modal
                                isOpen={modalIsOpen}
                                style={customStyles}
                                ariaHideApp={false}
                                >
                                    <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Lyrics</h5>
                                        <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
                                    </div>
                                    <div className="modal-body">
                                        {lyrics}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal} style={{float:'right'}}>Close</button>
                                    </div>    
                                    </div>
                                </Modal>
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
        </div>
    )
}
export default withRouter(Home);