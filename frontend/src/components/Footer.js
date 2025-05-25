import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
      <Container fluid="lg">
        <Row className="gy-4"> {/* gy-4 untuk spasi vertikal antar kolom di mobile */}
          
          {/* Kolom Deskripsi Aplikasi */}
          <Col md={12} lg={4}> 
            <h5 className="fw-bold text-white mb-3">MRSA Resistance Gene Detector</h5>
            <p className="text-white-50 small mb-0">
              A tool for detecting antibiotic resistance genes in Staphylococcus aureus (MRSA).
              Developed by ITB students.
            </p>
          </Col>

          {/* Kolom Quick Links */}
          {/* PERUBAHAN: Ditambahkan className="text-center text-lg-start" */}
          {/* text-center untuk semua ukuran, text-lg-start agar di layar besar (lg) kembali rata kiri jika diinginkan */}
          {/* Jika Anda ingin selalu rata tengah, cukup gunakan "text-center" */}
          <Col xs={12} sm={6} md={6} lg={4} className="text-center"> 
            <h5 className="text-white mb-3">Quick Links</h5>
            {/* PERUBAHAN: Jika ingin ul juga ikut tengah, bisa tambahkan d-inline-block atau styling custom */}
            {/* Namun, biasanya ul tetap rata kiri di dalam kolom yang text-center untuk itemnya */}
            <ul className="list-unstyled">
              <li className="mb-2">
                {/* Kelas footer-link akan diatur di CSS untuk garis bawah */}
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="footer-link">About</Link>
              </li>
              <li className="mb-2">
                <Link to="/analysis" className="footer-link">Analysis</Link>
              </li>
              <li>
                <a href="https://www.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer" className="footer-link">
                  NCBI
                </a>
              </li>
            </ul>
          </Col>

          {/* Kolom Developed By */}
          <Col xs={12} sm={6} md={6} lg={4}>
            <h5 className="text-white mb-3">Developed By</h5>
            <ul className="list-unstyled text-white-50 small">
              <li className="mb-1">Jonathan Wiguna (18222019)</li>
              <li className="mb-1">Harry Truman Suhalim (18222081)</li>
              <li>Steven Adrian Corne (18222101)</li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />
        
        <div className="text-center">
          <p className="mb-0 text-white-50 small">
            © {new Date().getFullYear()} MRSA Resistance Gene Detector. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;