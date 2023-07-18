const CreateActivityNavigation = (activityId) => {
  return [
    {
      label: "Draft",
      href: "/create-activity",
    },
    {
      label: "Deployment",
      href: `/create-activity/${activityId}/deployment`,
    },
    {
      label: "Terms & Conditions",
      href: `/create-activity/${activityId}/terms-and-conditions`,
    },
    {
      label: "Overview",
      href: `/create-activity/${activityId}/overview`,
    },
  ];
};

export default CreateActivityNavigation;
