import type { NextPage } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import styles from '../../styles/Profile.module.css';
import { TextInput, NumberInput, Button, Input } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertTriangle } from '@tabler/icons';
import axios from "axios";
import {
  createStyles,
  Menu,
  Center,
  Header,
  Container,
  Group,
  Burger,
  Grid,
  Card
} from '@mantine/core';
import users from '../api/auth/lib/model/users';
import { lazy, useCallback, useEffect, useMemo, useState } from 'react';
import {useSession ,signIn, signOut} from 'next-auth/react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'
import { setNestedObjectValues } from 'formik';
import { CgProfile } from 'react-icons/cg';
import {FiEdit2, FiInstagram, FiTwitter, FiGlobe, FiMail} from 'react-icons/fi'
import {FiArchive, FiUpload} from 'react-icons/fi';

const Pana: NextPage = () => {
    const {data:session, status} = useSession();
    const [editProfile, setEditProfile] = useState(false);
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [instagram, setInstagram] = useState("");
    const [twitter, setTwitter] = useState("");
    const [link1, setLink1] = useState("");
    const [link2, setLink2] = useState("");
    const [category, setCategory] = useState<any[]>([]);
    const [avatar, setAvatar] = useState("");
    const [avatarFile, setAvatarFile] = useState("");
    const [images, setImages] = useState<any[]>([]);
    const [uploadImages, setUploadImages] = useState<any[]>([]);
    const [alert, setAlert] = useState("");
    const [message, setMessage] = useState("");
    const [admin, setAdmin] = useState(false);
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState<any>();

    const router = useRouter();
    useEffect(()=>{

          if(!email){
            console.log('get user')
            getUser();
          }
      
    }, []);

  useEffect(() => {

    if(!user){
        console.log('get user')
        getUser();
    }

    if(username){
        console.log(username);
    }

    if(userId){
        console.log(userId);
    }

    if(session){
        console.log(session)
    }

  
    if(user){
        console.log(user);
        console.log(user._id);
        if(!images){
            getUserImages(); 
        }
    }
    
  }, [username, user, fullname, userId, email, images, avatar, bio, link1, link2, twitter, instagram, session])


    useEffect(()=>{
        if(!router.isReady) return;
        console.log(router.query);
        if(router.query.username){
            setUsername(router.query.username.toString());
        }
    }, [router.isReady]);

  const getUser = async() => {
    console.log('get user')
    if(username){
        const res = await axios
        .get(
            "/api/getUser?username="+username,
            {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            }
            }
        )
        .then(async (response) => {
            console.log(response.data.data);
            //console.log(response.data.data._id)
            setUser(response.data.data);
            setEmail(response.data.data.email);
            setFullname(response.data.data.fullname);
            setBio(response.data.data.bio);
            setCategory(response.data.data.category);
            setInstagram(response.data.data.instagramHandle);
            setTwitter(response.data.data.twitterHandle);
            setLink1(response.data.data.link1);
            setLink2(response.data.data.link2);
            setAvatar(response.data.data.avatar);
            setAdmin(response.data.data.admin);
            setUserId(response.data.data._id);
        })
        .catch((error) => {
            console.log(error);
            setAlert(error);
        });
        //console.log(res);
    }
  }

  const getUserImages = async() => {
    console.log('get images')
        const res = await axios
        .get(
            "/api/getUserImages?userId="+user._id,
            {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            }
            }
        )
        .then(async (response) => {
            let arr:any[] = [];
            console.log(response);
            response.data.data.forEach((item:any)=>{
                arr.push(item.image);
                //console.log(item.image);
            })
            setImages(arr);
            //console.log(images);
        })
        .catch((error) => {
            console.log(error);
            setAlert(error);
        });
  }

  return (
    <div className={styles.App}>
      
        <div className={styles.container} style={{minHeight:"85vh"}}>
        {session && 
        <>
            <Grid>
                <Grid.Col sm={3}><h1 style={{marginLeft:"2%"}}>{username}</h1></Grid.Col>
            </Grid>
            <hr></hr>
            <Grid>
                    <Grid.Col sm={4}>
                        <div style={{margin:"2% 0%"}}>
                            {!avatar && <CgProfile size="2em"/>}
                            {avatar && <img src={avatar}  className={styles.avatar}></img>}
                        </div>
                        <h4>{fullname}</h4>
                        <p>{bio}</p>
                        {category && 
                            <div>
                                <>
                                    <FiArchive></FiArchive>
                                    {category.map((str) => {
                                        return(
                                            <span key={str.id}> {str} </span>
                                        );
                                    })}
                                </>
                            </div>
                        }
                        {instagram && 
                            <span className={styles.socialLink}><Link href={"https://instagram.com/"+instagram} target="_blank"><FiInstagram></FiInstagram></Link></span>
                        }
                            {twitter && 
                            <span className={styles.socialLink}><Link href={"https://twitter.com/"+ twitter} target="_blank"><FiTwitter></FiTwitter></Link></span>
                        }
                        {link1 && 
                            <span className={styles.socialLink}><Link href={link1} target="_blank"><FiGlobe></FiGlobe></Link></span>
                        }
                        {link2 && 
                            <span className={styles.socialLink}><Link href={link2} target="_blank"><FiGlobe></FiGlobe></Link></span>
                        }
                        <br></br>
                    </Grid.Col>
                    <Grid.Col sm={8} className={styles.gallery}>
                        <>
                            <h3>Gallery</h3>
                            <Grid>
                            {images && 
                                images.map((item:any) => {
                                    return(
                                        <Grid.Col sm={4} key={item._id}><img className={styles.galleryImages} src={item}></img></Grid.Col>
                                    );
                                })
                            }
                            </Grid>
                        </>
                    </Grid.Col>
            </Grid>
        </>
        }

        {!username &&
            <p>Loading...</p>
        }
        </div>
    </div>
  );
}

export default Pana