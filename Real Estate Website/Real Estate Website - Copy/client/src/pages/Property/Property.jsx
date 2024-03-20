import React ,{useState}from 'react'
import './Property.css';
import {useQuery} from 'react-query';
import { useLocation } from 'react-router-dom';
import { getProperty } from '../../utils/api';
import {PuffLoader} from 'react-spinners';
import {AiFillHeart,AiTwotoneCar} from 'react-icons/ai'
import {MdMeetingRoom,MdLocationPin } from 'react-icons/md';
import {FaShower} from 'react-icons/fa';
import Map from '../../components/Map/Map';
import useAuthCheck from '../../hooks/useAuthCheck';
import { useAuth0 } from '@auth0/auth0-react';
import BookingModal from '../../components/BookingModal/BookingModal';
import { useContext } from 'react';
import UserDetailContext from '../../components/context/UserDetails';
import { Button } from '@mantine/core';
const Property = () => {
    const {pathname} = useLocation();
    const id=pathname.split("/").slice(-1);
    const {data,isLoading,isError}=useQuery(["resd",id],()=>getProperty(id))

    const [modalOpened,setModalOpened]=useState(false);
    const {validateLogin} = useAuthCheck();
    const {user}=useAuth0();

    const {userDetails:{token,bookings},setUserDetails}=useContext(UserDetailContext);

    if(isError){
        return(
          <div className='wrapper'>
            <span>Error while fetching the property details</span>
          </div>
        )
      }
      if(isLoading){
        return(
          <div className="wrapper flexCenter" style={{height:"60vh"}}>
            <PuffLoader/>
          </div>
        );
      }
  return (
    <div className="wrapper">
        <div className="flexColStart paddings innerWidth property-container">
            {/*like button */}
            <div className="like">
                <AiFillHeart size={24} color="white" />
            </div>
            {/*image */}
            <img src={data?.image} alt="home page"/>
            
            <div className="flexCenter property-details">
                {/*left side */}
                <div className="flexColStart left">
                    {/*head*/}
                    <div className="flexStart head">
                        <span className="primaryText">{data?.title}</span>
                        <span className="orangeText" style={{fontSize:'1.5rem'}}>$ {data?.price}</span>
                    </div>
                    {/*facilities*/}
                    <div className="flexStart facilities">
                        <div className="flexStart facility">
                            <FaShower size={20} color="#1F3E72" />
                            <span>{data?.facilities.bathrooms} Bathrooms</span>
                        </div>
                        <div className="flexStart facility">
                            <AiTwotoneCar size={20} color="#1F3E72"/>
                            <span>{data?.facilities.parkings} Parking</span>
                        </div>
                        <div className="flexStart facility">
                            <MdMeetingRoom size={20} color="#1F3E72"/>
                            <span>{data?.facilities.bedrooms} Room/s</span>
                        </div>
                    </div>
                    {/*description */}
                    <span className="secondaryText" style={{ textAlign: "justify" }}>
                        {data?.description}
                    </span>
                    {/* address*/}
                    <div className="flexStart" style={{ gap: "1rem" }}>
                        <MdLocationPin size={25} />
                        <span className="secondaryText">
                            {data?.address}{" "}
                            {data?.city}{" "}
                            {data?.country}
                        </span>
                        </div>
                        {/* {console.log(id)} */}
                        {/* {   bookings.map((booking)=>console.log(booking.id)) }  */}
                        {bookings?.map((booking)=> console.log(booking.id))}
                        {/* {bookings?.map((booking)=> booking.id).includes(id) ? console.log("Hello") : console.log("bye")} */}
                         {   bookings?.map((booking)=> booking.id).includes(id) ? (
                                <>
                                    <Button variant="outline" w={"100%"} color="red">
                                        <span>Cancel Booking</span>
                                    </Button>
                                    <span>
                                        Your visit already booked for date {bookings?.filter((booking)=>booking?.id === id)[0].date}
                                    </span>
                                </>
                            ): (
                                
                                <button className="button" onClick={()=>{
                                    validateLogin() && setModalOpened(true);
                                }}>
                                    Book Your Visit
                                </button>
                            )
                        }
                        <BookingModal 
                        opened={modalOpened}
                        setOpened={setModalOpened}
                        propertyId={id}
                        email={user?.email}
                        />
                </div>
                {/*right side*/}
                <div className="right">
                    <Map address={data?.address} city={data?.city} country={data?.country}/>
                </div>
            </div>

        </div>
    </div>
  )
}

export default Property