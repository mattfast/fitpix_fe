import { loadStripe } from '@stripe/stripe-js';

export const logClick = async (position: string) => {
  fetch(
    `${process.env.REACT_APP_BE_URL}/log-click`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "position": position
      })
    }
  );
}

let stripePromise;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "");
  }
  return stripePromise;
};

export const makeCookie = (len: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < len) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const formatPhoneNumber = (input: string) => {
  if (input.length == 0) {
    return ``;
  } else if (input.length <= 3) {
    return `(${input}`;
  } else if (input.length <= 6) {
    return `(${input.slice(0, 3)}) ${input.slice(3)}`;
  } else {
    return `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
  }
};

export const s3_url = (user_id: string, num: number) => {
  return `https://dopple-generated.s3.amazonaws.com/${user_id}/profile_${num}.png`;
};

export const validateCookie = async (cookie: string | null | undefined) => {

  if (!cookie) return false;

  const response = await fetch(
    `${process.env.REACT_APP_BE_URL}/validate-cookie`,
    { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "cookie": cookie
      })
    }
  );

  try {
    const respJson = await response.json();
    if (response.status !== 200) return "";
  
    return respJson["user_id"];
  } catch (e) {
    return "";
  }
}

export const difference = (date: Date) =>{
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const hours = Math.floor(diffInMins / 60);
  const secs = diffInSecs % 60;
  const mins = diffInMins % 60;

  return { hours, mins, secs }
}
