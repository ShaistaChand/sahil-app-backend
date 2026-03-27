import React from 'react';
import Header from './Header';
import Footer from './Footer';


const Layout = ({ children }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Header />
      <main style={{ 
        flex: 1, 
        padding: '1rem 0' // ✅ ADDED: Proper spacing
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};


export default Layout;

//  const Layout = ({ children }) => {
//   return (
//      <div className="main-layout">
//        <Header />
//       <main className="main-content">
//        {children}
//       </main>
//      <footer style={{
//           background: 'var(--surface)',
//        borderTop: '1px solid var(--border-light)',
//        padding: '2rem 0',
//        marginTop: 'auto'
//      }}>
//        <div className="container">
//          <div style={{
//            display: 'flex',
//            justifyContent: 'space-between',
//            alignItems: 'center',
//            flexWrap: 'wrap',
//            gap: '1rem'
//          }}>

//          <div className="logo" style={{ alignItems: 'flex-start' }}>

//  <div className="logo-icon" style={{width: '2.5rem', height: '2.5rem', fontSize: '1.25rem' }}>
//   {/* €  Changed back to Euro  */}
//   </div> 

//   <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
//     <span>Sahil App</span>
//     <span style={{ 
//      fontSize: '0.75rem', 
//      color: 'var(--text-light)', 
//      fontWeight: '400' 
//    }}>
//      Your Expense Tracker
//    </span>
//  </div>
// </div> 

//            <div style={{
//              color: 'var(--text-light)',
//              fontSize: '0.875rem'
//            }}>
//              © 2024 ExpenseTracker. All rights reserved.
//            </div> 
//          </div>
//        </div>
//      </footer>
//    </div>
//   );
//  };

