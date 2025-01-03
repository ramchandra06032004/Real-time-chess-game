'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { signOut, useSession } from 'next-auth/react';
import { IoIosMenu } from "react-icons/io";
function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };

    handleResize(); // Check initial width
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const {toast}=useToast();
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast({
        title: 'Logged out successfully',
      })
      router.push('/login');
    } catch (error: any) {
      console.log("Logout error:", error.message);
      toast({
        title: 'Error',
        description: 'An error occurred while logging out',
      })
    }
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="p-4 md:p-6 shadow-md ">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Real time chess game
        </Link>
        {isMobile ? (
          <div className="relative">
            <Button variant="ghost" onClick={toggleMenu}>
              <IoIosMenu size={24} />
            </Button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 shadow-lg rounded-md z-50 bg-[#09090b]">
                <div className="flex flex-col space-y-2 p-4">
                  {session ? (
                    <>
                      {session.user.role === 'admin' && (
                        <Link href="/admin">
                          <Button variant="ghost" onClick={toggleMenu}>Admin Panel</Button>
                        </Link>
                      )}
                      
                      <Link href="/profile">
                        <Button variant="ghost" onClick={toggleMenu}>Profile</Button>
                      </Link>
                      <Button onClick={() => { handleLogout(); toggleMenu(); }}>Logout</Button>
                    </>
                  ) : (
                    <Link href="/login">
                      <Button variant="ghost" onClick={toggleMenu}>Login</Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex space-x-4">
            
            {session ? (
              <>
                {session.user.role === 'admin' && (
                  <Link href="/admin">
                    <Button className='mr-4' variant="ghost">Admin Panel</Button>
                  </Link>
                )}
                <Link href="/profile">
                  <Button variant="ghost" className='mr-4'>Profile</Button>
                </Link>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;