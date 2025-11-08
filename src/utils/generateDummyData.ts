export const generateRandomEcommerceData = (email: string, phone: string) => {
  const randomId = Math.floor(Math.random() * 10000);
  return {
    customer: {
      email,
      phone,
      userId: `user_${randomId}`,
    },
    order: {
      id: `order_${randomId}`,
      total: Math.floor(Math.random() * 10000) / 100,
      items: [
        {
          id: `prod_${Math.floor(Math.random() * 1000)}`,
          name: "Premium Widget",
          price: 29.99,
          quantity: Math.floor(Math.random() * 5) + 1,
          category: "Electronics",
          variant: "Pro",
        },
        {
          id: `prod_${Math.floor(Math.random() * 1000)}`,
          name: "Deluxe Package",
          price: 49.99,
          quantity: Math.floor(Math.random() * 3) + 1,
          category: "Services",
          variant: "Annual",
        },
      ],
    },
    metadata: {
      source: "product_page",
      platform: "web",
      session: {
        id: `sess_${randomId}`,
        referrer: "google.com",
        device: "desktop",
      },
    },
  };
};
