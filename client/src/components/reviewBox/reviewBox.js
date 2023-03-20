import "./reviewBox.css";
import axios from "axios";
import React, {useEffect, useState} from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useHistory } from "react-router-dom";

const ReviewBox = (props) => {
  const [autour, setAutour] = useState({});

  const history = useHistory()

  const navigateReview = (editMode) => {
    console.log(props.movieId + props.reviewId)
    history.push({pathname: `/review/${props.movieId}/${props.reviewId}`, state: {editMode: editMode}});
  }
  
  const getAuthorDetails = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:4000/getUserById/${id}`);
      setAutour(data);
      console.log(data)
      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
          history.replace("/error");
      }
    }
  }

  const deleteReview = async() => {
    try {
      await axios.post("http://localhost:4000/deleteReview",{review: props.reviewId} ).then(res => {
        console.log(res);
        window.location.reload(false);
      })
    } catch (error) {
      if (error.response && error.response.status === 404) {
        history.replace("/error");
      }
    }
  }

  useEffect(async() => {
    console.log(props.logo)
    await getAuthorDetails(props.authorId);
  }, []);
  
  return (
    <>
      <div className="review__main">
        <div className="review_row">
            {
              (props.logo) ? (<img className="movie_logo" src={props.logo} onClick={() => navigateReview(false)}/>) : (<></>)
            }
            <div className="description" onClick={() => navigateReview(false)}>
                <h1 className="movie_title">{props.title}</h1>
                <h6 className="movie_description">{props.description}</h6>
                {
                  (props.authorId) ? (<li> REVIEW BY: <b className="review_by"> {autour.first_name}</b> </li>):(<></>)
                }
            </div>
            {
              (autour) ? 
                (<div className="autour_boxes">
                  <div className="review_box_button" onClick={() => navigateReview(true)}><ModeEditIcon></ModeEditIcon></div>
                  <div className="review_box_button" onClick={deleteReview}><DeleteForeverIcon></DeleteForeverIcon></div>
                </div>) :
                (<div></div>) 
            }
            
        </div>
      </div>
    </>
  );
};

export default ReviewBox;
