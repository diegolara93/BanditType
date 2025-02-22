'use client'

import { useAuth } from '@/utils/authContext';
import axios from 'axios';
import { PencilLine } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { Textarea } from './textarea';

interface EditProfileButtonProps {
  username: string;
}


const getUsername = async(uid: string) => {
    try {
        const resp = await axios.get(`http://127.0.0.1:8000/users/${uid}/username`)
        let username = JSON.stringify(resp.data).slice(1, -1);
        console.log("user here: ", username)
        return username
    } catch (error) {
        console.log("Failed to get username", error);
    }
}
export default  function EditProfileButton({ username }: EditProfileButtonProps) {
  const { user, loading } = useAuth();
  const [changeName, setChangeName] = useState(false)

  const [fetchedUsername, setFetchedUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user) {
      getUsername(user.uid).then(setFetchedUsername);
    }
  }, [user]);

  if (!user || fetchedUsername !== username) {
    return null;
  }

  let edit

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
    <Textarea className='resize-none h-[1rem]' placeholder='Enter new bio' />
    <Button className='ml-16'>Submit</Button>
    </div>
    )
  }
  console.log(changeName)
  
  return (
    edit
  );
}
