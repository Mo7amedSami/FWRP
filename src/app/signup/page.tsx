"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/app/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { 
      name, 
      email, 
      password, 
      "password-confirm": passwordConfirm, 
      "country-code": countryCode, 
      phone 
    } = event.target.elements;

    if (password.value !== passwordConfirm.value) {
      setError("Both passwords don't match");
      return;
    }
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;
      
      // Combine country code and phone into one field or store separately if needed
      const fullPhoneNumber = `${countryCode.value}${phone.value}`;

      // Store user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name.value,
        email: email.value,
        phone: fullPhoneNumber,
        uid: user.uid
      });

      // Redirect to complete profile page
      router.push("/complete-profile");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="mt-1">
                <Input id="name" name="name" type="text" autoComplete="name" required />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="mt-1 flex">
                <Input
                  id="country-code"
                  name="country-code"
                  type="text"
                  placeholder="+1"
                  className="w-20 mr-2"
                  required
                  onInput={e => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                />
                <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="(555) 555-5555" required pattern="[0-9]*" inputMode="numeric"
                  onInput={e => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">Please ensure that this phone number is reachable via WhatsApp.</p>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-1">
                <Input id="password" name="password" type="password" autoComplete="new-password" required />
              </div>
            </div>

            <div>
              <Label htmlFor="password-confirm">Confirm Password</Label>
              <div className="mt-1">
                <Input
                  id="password-confirm"
                  name="password-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}
            <div>
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

