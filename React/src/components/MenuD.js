import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./MenuD.scoped.css";
import { AuthContext } from "../App";
import { supabase } from "../supabaseClient";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from "axios";
import { createClient } from '@supabase/supabase-js'

const Win = () => {
    if (false) {
        return (<div>winza</div>)
    }
    else {
        return (<div>kritza</div>)
    }
}
// const Check_admin = ()=>{
//     console.log('3')
//     useEffect(()=>{
//         console.log(role?.role)
//         if (role.role ==='admin'){
//             return (<Link to="/admin" className="submenu">
//                     <img src="admin.png" alt="" className="s-admin" />
//                     <p className="t-con">Admin</p>
//                 </Link>)
//         }
//         else{
//             return (<div/>)
//         }
//     },[role])
// }

function ShowName({ token }) {
    if (token) {
        return <p className="t-name">{token?.user?.user_metadata?.Username}</p>
    }
    else {
        return <p className="t-name">Guest</p>
    }
}

function MenuD(props) {
    const { token, setToken } = useContext(AuthContext);
    const { isOpen, toggle } = props;

    const Slidestyle = isOpen ? "open" : "close"

    async function handleLogout() {

        const { error } = await supabase.auth.signOut()

    }
    const [role, setRole] = useState({});
    useEffect(() => {
        axios.post("http://localhost:3001/role", { token_id: token?.user?.id }).then((response) => {
            setRole(response.data);
            console.log("update");
        }).catch((err) => { console.log(err) });
        // console.log('1')
    }, [token?.user?.id]);

    // const [verify, setVerify] = useState({});
    // useEffect(() => {
    //     axios.post("http://localhost:3001/role",{token_id : token?.user?.id}).then((response) => {
    //         setVerify(response.data);
    //         console.log("update");
    //     }).catch((err) => { console.log(err) });
    //     console.log('1')
    // }, [token?.user?.id]);

    const [admin, setAdmin] = useState(false)
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState(null);
    // console.log(verify)
    // const [avatar_url,setAvatar] = useState(null);
    // const  url = avatar_url
    // if (token?.user?.user_metadata?.id = ){
    const Check_admin = () => {
        // console.log('3')

        if (role.role === 'admin') {
            return (<Link to="/admin" className="submenu">
                <img src="admin.png" alt="" className="s-admin" />
                <p className="t-con">Admin</p>
            </Link>)
        }
        else {
            return (<div className="noadmin" ></div>)
        }
    }
    console.log(role?.verify)
    const Check_verify_yes = () => {
        // console.log('456')

        if (role.verify === 'yes') {
            return (<img src="Vaccount.png" alt="" className="s-verr" />)
        }
    }
    const Check_verify_no = () => {
        
        if (role.verify === 'no') {
           
            return (<Link to="/verify" className="V-acc">
            <img src="Vaccount.png" alt="" className="s-ver" />
            <p className="t-ver">Verify account</p>
        </Link>)
        }
    }
    const Check_avatar = () => {
        
        if ( token !== null ) {
            return (<div>
                    <label style={{ width: "5vw", fontSize: "0.7vw", left: "0.2vw", position: "relative" }} htmlFor="single">
                    <AddPhotoAlternateIcon /> {uploading ? "Uploading..." : "Choose your image"}
                    </label>
                    <input
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading} />
                    </div> )
        }
    }

    // console.log(token)
    // }
    const onUpload = (url) => {

        const { data } = supabase.storage.from('avatars').getPublicUrl(url)
        console.log(data)
        // setAvatar(data?.publicUrl)
        updataProfile({ username: token?.user?.user_metadata?.Username, avatar_url: data?.publicUrl })
    }
    // useEffect(()=>{
    //     getProfile();
    // },[token])

    // async function getProfile (){
    //     try{
    //         setLoading(true);
    //         let {data,error,status} = await supabase
    //                                         .from('profiles')
    //                                         .select(`username , avatar_url`)
    //                                         .eq('id',token?.user?.id)
    //                                         .single()
    //         if (error && status !==406){
    //             throw error
    //         }
    //         if (data){
    //             setUsername(data.username);
    //             setAvatar(data.avatar_url);
    //         }
    //     }catch(error){
    //         alert(error.message);
    //     }finally{
    //         setLoading(false);
    //     }
    // }
    async function updataProfile({ username, avatar_url }) {
        try {
            setLoading(true);
            // const user = supabase.auth.user();

            const user = token?.user
            const updates = {
                id: user.id,
                username,
                avatar_url,
                updated_at: new Date(),

            }
            console.log(user)
            let { error } = await supabase.from('profiles').upsert(updates, {
                returning: "minimal"
            })
            const { data, error1 } = await supabase.auth.updateUser({
                data: { avatar_url: avatar_url }
            })
            if (error) {
                throw error;
            }
        } catch (error) {
            // alert(error.message);
            console.log(error)
        } finally {
            setLoading(false);
        }
    }


    // const [profile, setProfile] = useState([]);
    // useEffect(() => {
    //     axios.get("http://localhost:3001/getprofile").then((response) => {
    //         setProfile(response.data);
    //         console.log("update");
    //     }).catch((err) => { console.log(err) });
    // }, []);





    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);


    // useEffect(() => {
    //     if (url) downloadImage(url);
    // }, [url]);
    // async function downloadImage(path) {  ///for download img
    //     try {
    //         const { data, error } = await supabase.storage.from('avatars').download(path);
    //         if (error) {
    //             throw error;
    //         }
    //         const url = URL.createObjectURL(data);
    //         // console.log(url)
    //         setAvatarUrl(url);
    //     } catch (error) {
    //         console.log('Error downloading image: ', error.message)
    //     }
    // }
    async function uploadAvatar(event) {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${token?.user?.id}.${fileExt}`;
            const filePath = `${fileName}`
            let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
            if (uploadError) {
                throw uploadError;
            }
            onUpload(filePath);
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    }






    return (

        <div className={`background ${Slidestyle}`}>
            <div className="container-top" >
                <img src="logomenu.png" alt="" className="logo" />
                <img src="back.png" alt="" className="back" onClick={toggle} />

            </div>
            <hr className="line" />
            <div className="menu">
                <Link to="/Detail-pin" className="submenu">
                    <img src="Prestroom.png" alt="" className="s-pin" />
                    <p className="t-pin">Pin restroom</p>
                </Link>
                <Link to="/Ticket" className="submenu">
                    <img src="Csupport.png" alt="" className="s-con" />
                    <p className="t-con">Contact support</p>
                </Link>
                <Check_admin />
               

                {/* <Link to="/admin" className="submenu">
                    <img src="admin.png" alt="" className="s-admin" />
                    <p className="t-con">Admin</p>
                </Link> */}
            </div>

            <hr className="line2" />
            {/* <Link to="/verify" className="V-acc">
                    <img src="Vaccount.png" alt="" className="s-ver" />
                    <p className="t-ver">Verify account</p>
                </Link> */}
            <div className="name">
                {/* <input className="input-profile" type="file" id="file" />
                <label for="file">
                    Choose your Profile
                </label> */}
                <div className="profile">
                    <div className="pic">
                    {token?.user?.user_metadata?.avatar_url ? (
                        <img src={token?.user?.user_metadata?.avatar_url + "?nocache=" + Date.now().toString()} alt="Avatar" className="s-name"></img>
                    ) : (<img src="formpic.png" alt="" className="s-name" />

                    )}
                    </div>
                    <Check_avatar/>
                    {/* <label style={{ width: "5vw", fontSize: "0.7vw", left: "0.2vw", position: "relative" }} htmlFor="single">
                        <AddPhotoAlternateIcon /> {uploading ? "Uploading..." : "Choose your image"}
                    </label>
                    <input
                        type="file"
                        id="single"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                    /> */}
                </div>
                {/* <div className="profile">
                    <img src="formpic.png" alt="" className="s-name" />
                    <label for = "file">
                    <input className="input-profile" type="file" id="file" />
                    <AddPhotoAlternateIcon/> Choose your Profile 
                    </label>
                </div> */}
                <div className="contain-name">
                    <p className="t-name">{token?.user?.user_metadata?.Username ?? "Guest"}</p>
                    {/* {ShowName(token)} */}
                    {/* <ShowName token={token} /> */}
                    {/* <Link to="/verify" className="V-acc">
                        <img src="Vaccount.png" alt="" className="s-ver" />
                        <p className="t-ver">Verify account</p> 
                       
                    </Link> */}
                    <Check_verify_no/>
                </div>
                    <Check_verify_yes/>
                {/* <img src="Vaccount.png" alt="" className="s-verr" /> */}
            </div>
            <Link to="/login" className="login" style={token ? { visibility: "hidden" } : { width: "37%" }}>
                <img className="pic-login" src="login.svg" alt="" />
                <p className="t-login">Login</p>
            </Link>
            <button className="logout" onClick={handleLogout} style={token ? { width: "37%" } : { visibility: "hidden" }} >Log out</button>

        </div>

    )
}
export default MenuD;