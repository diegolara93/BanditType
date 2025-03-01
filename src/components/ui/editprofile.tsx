'use client'

import { useAuth } from '@/utils/authContext';
import axios from 'axios';
import { PencilLine } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { Textarea } from './textarea';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/utils/firebase';

interface EditProfileButtonProps {
  username: string;
}

const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;

const updateBio = async(uid: string, bio: string, user: User) => {
  try {
    const token = await user.getIdToken();
    const resp = await axios.put(
      `${apiBaseURL}/users/${uid}/bio`, 
      { bio: bio },  // Send in request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000  // 10 second client-side timeout
      }
    );
    alert("Bio changed, please refresh");
    return true;
  } catch (error) {
    console.log("Error updating bio: ", error);
    return false;
  }
}


const getUsername = async(uid: string) => {
    try {
        const resp = await axios.get(`${apiBaseURL}/users/${uid}/username`)
        let username = JSON.stringify(resp.data).slice(1, -1);
        console.log("user here: ", username)
        return username
    } catch (error) {
        console.log("Failed to get username", error);
    }
}
export default  function EditProfileButton({ username }: EditProfileButtonProps) {
  const [changeName, setChangeName] = useState(false)
  const [isMounted, setIsMounted] = useState(false);
  const [fetchedUsername, setFetchedUsername] = useState<string | undefined>(undefined);


    const [user, setUser] = useState<User | null>(null);
    const [bioText, setBioText] = useState("");

  
  
    useEffect(() => {
      setIsMounted(true);
    }, [])
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
      });
      return () => unsubscribe();
    }, []);


  useEffect(() => {
    if (user) {
      getUsername(user.uid).then(setFetchedUsername);
    }
  }, [user]);

  if (!user || fetchedUsername !== username) {
    return null;
  }

  let edit

  if (!isMounted) {
    return null;
  }

  const handleClick = () => {
    setChangeName(!changeName)
  }


  if (!changeName) {
    edit = (
        <Link onClick={handleClick} href="">
          <PencilLine className='inline h-5 text-[#f38ba8]' />
        </Link>
    )
  } else {
    edit = (
        <div className='inline w-full'>
          <Link onClick={handleClick} href="">
            <PencilLine className='inline h-5 text-[#f38ba8]' />
          </Link>
          <Textarea 
            className='resize-none h-[1rem]' 
            placeholder='Enter new bio'
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
          />
          <Button onClick={() =>  {
            handleClick
            updateBio(user.uid, bioText, user)
          }
            } className='ml-16'>Submit</Button>
        </div>
    )
  }
  console.log(changeName)
  
  return (
    edit
  );
}
