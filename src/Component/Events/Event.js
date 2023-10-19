import React,{useState,useEffect} from 'react'
import './Event.css'
import firebase from './../../Service/FireBaseInit'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { useNavigate } from 'react-router-dom'
import Text from '../../Tools/Dictionary'
export default function Event({data,type,userInfo,SetTYPE}) {
  const GoTo = useNavigate()

  const [DetailState,SetDetailState]=useState(false)

  function Delete(id){
    firebase.firestore().collection("Events").doc(id).delete()
  }
  function TutorRegister(){
    firebase.firestore().collection('Events').doc(data.id).update({Tutors:firebase.firestore.FieldValue.arrayUnion({UserID:userInfo.uid,UserName:userInfo.name})})
  }
  function DeleteRegister(){
    let array = []
    data.Tutors.forEach((element,index) => {
      if (element.UserID !== userInfo.uid){
        array.push(element)
      }

    });
    firebase.firestore().collection('Events').doc(data.id).update({Tutors:array})
  }
  function CheckIfRegistered(){
    let arr = []
    data.Tutors.forEach(element => {
      arr.push(element.UserID)
    });
    if (arr.includes(userInfo.uid)){
      return(true)
    }else{
      return(false)
    }
  }

  const [Qrcode,SetQrcode] = useState(false)

  function EndQrcode(){
    SetQrcode(`https://chart.googleapis.com/chart?cht=qr&chl=${data.id}&chs=500x500`)
    firebase.firestore().collection('Events').doc(data.id).update({Finished:true})

  }

  const [stars,SetStars] = useState([])

  useEffect(()=>{
    let array = []
    for (let i = 1 ; i<=data.Level ; i++){
      array.push(i.toString())
    }
    SetStars(array)
  },[])
  return (
    <div className="Event_Main_Div" style={{opacity:(data.Finished?("0.6"):("1"))}}>
        

        {
          Qrcode && <div className='Qrcode_div'>
            <img src={Qrcode} />
            <button className='close' onClick={()=>{SetQrcode(false)}}>Close</button>
          </div>
        }


        <div className="Left_div">
          <div className="left_div">
            <img className="Tutor_Pic" onClick={()=>{GoTo(`/attend/7Xu4kIjLIjEXNHBqphLg`)}} src={data.Instructor.imgUrl}></img>
          </div>
          <div className="right_div">
            <label className="topic">{data.Topic}</label>
            <label className="detail">{Text("Instructor")}: {data.Instructor.name}</label>

            <div className="Tutors_div">
              <label className="detail">
                {Text("Tutors")}: 
                {data.Tutors.map((e)=>{
                  return(
                    <label className="detail"> {e.UserName} , </label>
                  )
                })}
              </label>
            </div>
            <label className="detail">{Text("DateTime")}: {data.EventDateTime.toDate().toLocaleString()}</label>

            <label className="detail">{Text('Location')}: {data.Location}</label>

            <label className="detail">{Text('Language')}: {data.Language}</label>

            <label className="detail">{Text("Level")}: {
              stars.map(()=>{
                return(
                  <label>⭐ </label>
                )
               })
            }</label>

            


              { !DetailState && <div className='lessdetail'   dangerouslySetInnerHTML={{ __html:"<p  >"+data.Description.replace('<br>','<br>')+"</p>" }} />}
              { DetailState && <div  className='details'  dangerouslySetInnerHTML={{ __html:"<p  >"+data.Description.replace('<br>','<br>')+"</p>" }} />}

            
            
            <div className="Type_div">
            
              {data.Type.map((e)=>{
                return(
                  <label onClick={()=>{SetTYPE(e)}}> {e} |</label>
                )
              })}
            </div>
          </div>
          
        </div>

        <div className="Right_div">
          <div className="date_div">
            <label className="title">{Text("RegisterDeadLine")} </label>
            <label>{data.RegisterDeadLine.toDate().toLocaleString()}</label>
          
          </div>
          <div className="btns_div">


            {type!=="tutor" && type!=="admin"&&!data.Finished&&<button className="Register" onClick={()=>{window.open(data.RegisterLink,"_blank")}}>{Text("Register")}</button>}

            {type==="tutor"&&!data.Finished&&data.Instructor.uid===userInfo.uid&&<button className="Register" onClick={()=>{EndQrcode()}}>End Qrcode</button>}
            {type==="tutor"&&!data.Finished&&data.Instructor.uid!==userInfo.uid&&!CheckIfRegistered()&&data.Tutors.length<data.MaxTutor&&<button className="Register" onClick={()=>{TutorRegister()}}>{Text("TutorRegister")}</button>}
            {type==="tutor"&&!data.Finished&&data.Instructor.uid!==userInfo.uid&&CheckIfRegistered()&&data.Tutors.length<data.MaxTutor&&<button className="Register" onClick={()=>{DeleteRegister()}}>{Text("CancelRegister")}</button>}

            {type==="tutor"&&!data.Finished&&data.Instructor.uid!==userInfo.uid&&!CheckIfRegistered()&&data.Tutors.length>data.MaxTutor&&<button className="Details">{Text("Full")}</button>}
            

            {type==="admin"&&<button className="Register" onClick={()=>{GoTo(`../admin_update_event/${data.id}`)}}>{Text("Edit")}</button>}
            {type!=="admin"&&<button className="Details" onClick={()=>{if(DetailState){SetDetailState(false)}else{SetDetailState(true)} }}>{Text("MoreDetail")}</button>}
            {type==="admin"&&<button className="Details" onClick={()=>{Delete(data.id)}}>{Text("Delete")}</button>}


            {/* <div>

            </div> */}
          </div>

          
          
        </div>
    </div>
  )
}
