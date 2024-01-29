const version = "v1";

export const ApiUrl = {
  userBaseUrl: `${import.meta.env.VITE_API_BASE_URL}/api/${version}/user`,
  categorycaBaseUrl: `${
    import.meta.env.VITE_API_BASE_URL
  }/api/${version}/category`,
  blogBaseUrl: `${import.meta.env.VITE_API_BASE_URL}/api/${version}/blog`,
  commentBaseUrl: `${import.meta.env.VITE_API_BASE_URL}/api/${version}/comment`,
};
