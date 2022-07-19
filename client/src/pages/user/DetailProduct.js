import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { Button } from "react-bootstrap"

import { API } from '../../config/api';

function DetailProduct() {
  let navigate = useNavigate();
  let { id } = useParams();

  let { data: product } = useQuery('productCache', async () => {
    const response = await API.get('/Product/' + id);
    return response.data.data;
    console.log(response.data);
  });

  // Create config Snap payment page with useEffect here ...
  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = "SB-Mid-client-3SZeGcpD3kKlTTw3";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, [])

  const handleBuy = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const data = {
        idProduct: product.id,
        idSeller: product.user.id,
        price: product.price,
      };

      const body = JSON.stringify(data);

      const response = await API.post('/Transaction', body, config);

      // Create variabel for store token payment from response here ...
      const token = response.data.payment.token;

      // Init Snap for display payment page with token here ...
      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/user/profile");
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate("/user/profile");
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert("you closed the popup without finishing the payment");
        },
      })
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="detail-container row">
      <div className="col-md-6 col-xs-12">
        <img src={product?.image} className="img-detail" alt="" />
      </div>
      <div className='col-md-6 col-xs-12 col-xs-mt-5"'>
        <p className='detail-head-text'> Mouse </p>
        <p className='detail-text'> Stock: {product?.qty} </p>
        <p className='detail-text'> {product?.desc} </p>
        <p className='detail-price d-flex justify-content-end'> Rp. {product?.price} </p>
        <Button onClick={(e) => handleBuy.mutate(e)} variant="danger" className="button-login-login">Buy</Button>
      </div>
    </div>
  );
}

export default DetailProduct;