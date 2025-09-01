// Block HOCs
export const withProduct = (Component: any) => {
  return (props: any) => {
    return <Component {...props} />;
  };
};

export const withProductVariation = (Component: any) => {
  return (props: any) => {
    return <Component {...props} />;
  };
};
