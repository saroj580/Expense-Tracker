import React, {useState} from 'react'
import AuthLayout from '../../components/layout/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePicSelector from '../../components/Input/ProfilePicSelector';

export default function SignUp() {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[error, setError] = useState(null);


  const navigate = useNavigate();

  //handle signup form submit
  const handleSignUp = async (e) => {
    e.preventDefault();

  }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-20 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-purple-700'>Create an Acount</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Join us by today by entering details below.</p>

        <form onSubmit={handleSignUp}>

          <ProfilePicSelector image={profilePic} setImage = {setProfilePic} />
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Input
              type='text'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="fullName"
              placeholder='Jhon'
            />
            <Input
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="E-mail Address"
              placeholder='Jhone@example.com'
            />
            <div className='col-span-2 '>
              <Input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="password"
                placeholder='********'
              />
            </div>
          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>SignUp</button>

          <p className='text-[13px] text-slate-800 mt-3' >
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
          
        </form>
      </div>

    </AuthLayout>
  )
}
