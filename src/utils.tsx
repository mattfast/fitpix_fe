
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
