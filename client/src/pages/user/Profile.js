import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../context/userContext'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { Col, Row, Card, Button } from 'react-bootstrap'
import dateFormat from 'dateformat';
import convertRupiah from "rupiah-format";
import { useQuery } from 'react-query';



import imgBlank from '../../assets/blank-profile.png';

import { API } from '../../config/api';


function Profile() {

    const title = 'Profile';
    document.title = 'DumbMerch | ' + title;
  
    const [state] = useContext(UserContext);
  
    let { data: profile } = useQuery('profileCache', async () => {
      const response = await API.get('/Profile');
      return response.data.data;
    });

   
  
    let { data: transactions } = useQuery('transactionsCache', async () => {
      const response = await API.get('/Transaction');
      return response.data.data;
    });

    return (
        <div className='user-container'>
            <div className='row'>
            <div className="col-lg-3 col-md-6 col-sm-12">
                <p className='user-text'>My Profile</p>
                <div className='container-profil-pitc'>
                <img src={profile?.image ? profile?.image : imgBlank} className="profile-pict" alt="..." />
                    <Button className="btneditProfile px-4 py-2 mt-4" as={Link} to='/user/profile/edit' > Edit Profil</Button>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 pt-5 mb-3">
                <p className="card-title-text">Name</p>
                <p className="profile-card-text m-0">{profile?.user?.name}</p>
                <p className="card-title-text mt-4">Email</p>
                <p className="profile-card-text m-0">{state.user.email}</p>
                <p className="card-title-text mt-4">Phone</p>
                <p className="profile-card-text m-0">{profile?.phone ? profile?.phone : '-'}</p>
                <p className="card-title-text mt-4">Gender</p>
                <p className="profile-card-text m-0">{profile?.gender ? profile?.gender : '-'}</p>
                <p className="card-title-text mt-4">Address</p>
                <p className="profile-card-text m-0">{profile?.address ? profile?.address : '-'}</p>
            </div>
            <div className="col-lg-5 col-md-12 col-sm-12" style={{ padding: '0' }}>
                <p className='user-text'>My Transaction</p>
                {transactions?.map((item, index) => (
                    <Card className='mb-2 history-card' key={index}>
                        <Row>
                            <Col sm={3}>
                                <img src={item.product?.image} alt="" className="img-history" />
                            </Col>
                            <Col sm={5}>
                                <p className='card-title-text' style={{ marginTop: '10px' }}>{item.product?.name}</p>
                                <p className='history-card-date'>{dateFormat(item.createdAt, 'dddd, d mmmm yyyy')}</p>
                                <p className='history-card-text' style={{ marginTop: '10px' }}>Price: {convertRupiah.convert(item.price)}</p>
                                <p className='history-card-text' style={{ marginTop: '20px' }}><b>Sub Total: {convertRupiah.convert(item.price)}</b></p>
                            </Col>
                            <Col sm={4}>
                            <div
                            className={`status-transaction-${item.status} rounded h-100 w-100 d-flex align-items-center justify-content-center`}
                          >
                            {item.status}
                          </div>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </div>
            </div>
        </div>
    );
}

export default Profile;