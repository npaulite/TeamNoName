import React, { useState } from 'react';
import { auth, db } from './firebase-config'
import { onAuthStateChanged } from '@firebase/auth';
import {doc, getDoc} from "firebase/firestore"
import Navba from './Navba';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import JaneHopkinsDoctor from './pages/JaneHopkinsDoctor';
import JaneHopkinsAdmin from './pages/JaneHopkinsAdmin';
import Bavaria from './pages/Bavaria';
import FDA from './pages/FDA';
import AddForm from './pages/AddForm';
import UpdateForm from './pages/UpdateForm';
import SendDrugs from './pages/SendDrugs';
import RequireAuth from './RequireAuth';
import useAuth from './hooks/useAuth';
import AuthContext from './hooks/AuthProvider';

export const SignOut = () => {
  auth.signOut()
  window.location.reload(false)
}

function App() {

  const {authorized, setAuth} = useAuth()
  const [user, setUser] = useState()
  const [id, setID] = useState()
  const [userDetail, setUserDetail] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: ""
  })

  const getUserDetails = (id) => {
    const usersRef = doc(db, 'users', id)
    return getDoc(usersRef)
  }

  onAuthStateChanged(auth, (currentUser) => {
    if(currentUser) {
    setUser(currentUser)
    setID(currentUser.uid)
    if(id) {
      getUserDetails(id)
      .then(user => {
        if(user.exists) {
          setUserDetail(user.data())
        }
      })
      }}}
    )

    
  return (
    <div className='app'>
      <AuthContext.Provider value={{user: user, setUser: setUser,
        id: id, setID: setID, userDetail: userDetail, setUserDetail: setUserDetail,
        authorized: authorized, setAuth: setAuth
      }}>

        <Navba></Navba>
        <div>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/Login'  element={<Login/>} />
          <Route element={<RequireAuth allowedRoles={['FDA', 'Admin']} />}>
          <Route path='/FDA'  element={<FDA/>} />
          </Route>
          <Route element={<RequireAuth allowedRoles={['Bavaria', 'Admin']} />}>
          <Route path='/Bavaria'  element={<Bavaria/>} />
          </Route>
          <Route element={<RequireAuth allowedRoles={['JaneHopkinsDoctor', 'Admin']} />}>
          <Route path='/JaneHopkinsDoctor'  element={<JaneHopkinsDoctor/>} />
          </Route>
          <Route element={<RequireAuth allowedRoles={['JaneHopkinsAdmin', 'Admin']} />}>
          <Route path='/JaneHopkinsAdmin'  element={<JaneHopkinsAdmin/>} />
          </Route>
          <Route element={<RequireAuth allowedRoles={['JaneHopkinsDoctor', 'Admin']} />}>
          <Route path='/JaneHopkinsDoctor/AddPatient'  element={<AddForm/>} />
          </Route>
          <Route element={<RequireAuth allowedRoles={['JaneHopkinsDoctor', 'Admin']} />}>
          <Route path='/JaneHopkinsDoctor/UpdatePatient'  element={<UpdateForm/>} />
          </Route>
          <Route element={<RequireAuth allowedRoles={['Bavaria', 'Admin']} />}>
          <Route path='/Bavaria/SendDrugs' element={<SendDrugs/>} />
          </Route>
        </Routes>
        </div>

        </AuthContext.Provider>
   </div>
  );
}

export default App;