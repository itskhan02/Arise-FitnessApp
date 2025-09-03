// import React from 'react'
// import  { useState } from 'react';
// import { Button, message, Steps, theme, Progress } from 'antd';
// import { MoveLeft } from 'lucide-react';
// import Gender from './Gender';

// const steps = [
//   {
//     title: 'Gender',
//     content:<Gender/>,
//   },
//   {
//     title: 'Second',
//     content: 'Second-content',
//   },
//   {
//     title: 'Last',
//     content: 'Last-content',
//   },
// ];

// const Goal = () => {
//   const { token } = theme.useToken();
//   const [current, setCurrent] = useState(0);

//   const next = () => {
//     setCurrent(current + 1);
//   };

//   const percent = ((current + 1) / steps.length) * 100;

//   const contentStyle = {
//     lineHeight: '260px',
//     textAlign: 'center',
//     color: token.colorTextTertiary,
//     backgroundColor: token.colorFillAlter,
//     borderRadius: token.borderRadiusLG,
//     border: `1px dashed ${token.colorBorder}`,
//     marginTop: 16,
//   };

//   return (
//     <>
//       <div
//         className="landing-page"
//         style={{
//           height: "98vh",
//           display: "flex",
//           justifyContent: "space-around",
//           alignItems: "center",
//           flexDirection: "column",
//           gap: "2rem",
//           margin: ".5rem",
//           background: "linear-gradient(135deg, #101325ff 0%, #14257aff 60%, #3d1090ff 100%)",
//           boxShadow: "0 0 40px 10px #3a1c71, 0 0 80px 10px #151e48ff inset",
//           borderRadius: "2rem",
//           position: "relative",
//           overflow: "hidden",
//         }}>
//         <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: 500, marginBottom: 2 }}>
//           {current > 0 && (
//             <Button style={{ marginRight: 16, backgroundColor: "transparent", border: "none", color: "#fff" }} onClick={() => setCurrent(current - 1)}>
//               <MoveLeft size={32} /> 
//             </Button>
//           )}
//           <Progress
//             percent={percent}
//             showInfo={false}
//             strokeColor={token.colorPrimary}
//             style={{ flex: 1 }}
//           />
//         </div>
//         <div style={{ ...contentStyle, height: "70vh", width: "97%", border: "1px transparent", borderRadius: "1rem", lineHeight: 1.5 }}>
//           {steps[current].content}
//         </div>
//         <div style={{ marginTop: "2rem",height: "10vh", width: "100%", maxWidth: 500, display: "flex", justifyContent: "center" }}>
//           {current === steps.length - 1 && (
//             <Button type="primary" onClick={() => message.success('Processing complete!')}>
//               Done
//             </Button>
//           )}
//           {current < steps.length - 1 && (
//             <Button type="primary" onClick={() => next()}>
//               Next
//             </Button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Goal
