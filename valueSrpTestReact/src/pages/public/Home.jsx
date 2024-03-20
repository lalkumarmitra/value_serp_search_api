import React, { useState } from 'react'
import BreadCrumb from "../../components/common/BreadCrumb";
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Row } from 'react-bootstrap';
import ImageViewer from '../../components/ImageViewer';
import { setResult } from '../../features/Search/searchSlice';
import { setPreloader } from '../../features/Ui/uiSlice';
import { swal } from '../../helper/swal';
import { CSVLink } from "react-csv"
import { auth } from '../../helper/api_url';
function Home() {
  const dispatch = useDispatch();
  const s = useSelector(state=>state.search)
  const [searchText,setSearchText] = useState('');
  const [csvData,setCsvData] = useState([]);
  const headers = [
    { label: "Title", key: "title" },
    { label: "Description", key: "description" },
    { label: "Link", key: "link" }
  ];
  const handleSearch = e => {
    if(searchText){
      dispatch(setPreloader({loader:true,message:'Searching Please Wait ....'}));
      auth.search(searchText)
      .then(res => {
        let r = res.data.result;
        setCsvData(r?.organic_results?.map(i=>({title:i.title,description:i.snippet,link:i.link})));
        dispatch(setResult({searchText:searchText,searchResult:r}));
      })
      .catch(e => swal.error(e.response?e.response.data.message:e.message))
      .finally(()=>dispatch(setPreloader({loader:false,message:''})))
    }
  };
  return (
    <>
      <BreadCrumb title={'Value SERP API Test'} />
      <Row>
          <Col lg={12}>
              <Card>
                  <Card.Header className="border-0">
                      <div className="row justify-content-center mb-4 mt-4">
                          <div className="col-lg-6">
                            <form onSubmit={e=>{e.preventDefault();handleSearch(e)}}>
                              <div className="row g-2">
                                  <div className="col">
                                      <div className="position-relative mb-3">
                                          <input type="text" value={searchText} onChange={e=>setSearchText(e.target.value)} className="form-control form-control-lg bg-light border-light" placeholder="Search here.." />
                                          <a className="btn btn-link link-success btn-lg position-absolute end-0 top-0" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample"><i className="ri-mic-fill"></i></a>
                                      </div>
                                  </div>
                                  <div className="col-auto">
                                      <button type="submit" className="btn btn-primary btn-lg waves-effect waves-light"><i className="mdi mdi-magnify me-1"></i> Search</button>
                                  </div>
                              </div>
                            </form>
                          </div>
                          {s.searchText && (
                            <div className="col-lg-12">
                                <h5 className="fs-16 fw-semibold text-center mb-0">Showing results for "<span className="text-primary fw-medium fst-italic">{s.searchText}</span> "</h5>
                            </div>
                          )}
                      </div>
                      
                      <div className="offcanvas offcanvas-top" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                          <div className="offcanvas-body">
                              <button type="button" className="btn-close text-reset float-end" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                              <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                                  <div className="search-voice">
                                      <i className="ri-mic-fill align-middle"></i>
                                      <span className="voice-wave"></span>
                                      <span className="voice-wave"></span>
                                      <span className="voice-wave"></span>
                                  </div>
                                  <h4>Talk to me, what can I do for you?</h4>
                              </div>
                          </div>
                      </div>
                  </Card.Header>
                  {s?.searchResult ? (
                    <>  
                      <div>
                          <ul className="nav nav-tabs nav-tabs-custom" role="tablist">
                              <li className="nav-item" role="presentation">
                                  <a className="nav-link active" data-bs-toggle="tab" href="#all" role="tab" aria-selected="true">
                                      <i className="ri-search-2-line text-muted align-bottom me-1"></i> All Results
                                  </a>
                              </li>
                              <li className="nav-item" role="presentation">
                                  <a className="nav-link" data-bs-toggle="tab" id="images-tab" href="#images" role="tab" aria-selected="false" tabIndex="-1">
                                      <i className="ri-image-fill text-muted align-bottom me-1"></i> Images
                                  </a>
                              </li>
                              <li class="nav-item ms-auto" role="presentation">
                                  <div class="dropdown">
                                    {csvData && (
                                    <CSVLink class="btn btn-sm me-3 btn-success fw-medium  mb-n1"  data={csvData} headers={headers}>
                                          <i class=" ri-file-excel-2-line align-middle me-1"></i> Export
                                    </CSVLink>)}          
                                  </div>
                              </li>
                          </ul>
                      </div>
                      <Card.Body className='p-4'>
                          <div className="tab-content text-muted">
                              <div className="tab-pane active show" id="all" role="tabpanel">
                                  {s?.searchResult?.knowledge_graph && (
                                    <>
                                      <div className="pb-3">
                                          <h5 className="mb-1"><a href="javascript:void(0);">{s?.searchResult?.knowledge_graph?.title} {s?.searchResult?.knowledge_graph?.type}</a></h5>
                                          <p className="text-success mb-2">{s?.searchResult?.knowledge_graph?.website}</p>
                                          <p className="text-muted mb-2">{s?.searchResult?.knowledge_graph?.description}</p>
                                      </div>
                                      <div className="border border-dashed"></div>
                                    </>
                                  )}
                                  {s.searchResult?.inline_images && (
                                    <div>
                                      <div className="py-3">
                                          <h5 className="fs-13 mb-3 text-muted fst-italic">Showing results Images</h5>
                                          <div className="row">
                                              <div className="col-xl-4 col-lg-10">
                                                  <div className="row g-2">
                                                      {s.searchResult?.inline_images?.slice(0, 4).map((i,index)=>index != 3 ?(
                                                        <div key={index} className="col-md-3 col-sm-6">
                                                            <div className="search-more-results rounded">
                                                                <div className="image-popup d-block">
                                                                    <img src={i.image} alt="" style={{aspectRatio:'16/11',objectFit:'cover',width:'100%'}} className="img-fluid d-block rounded" />
                                                                </div>
                                                            </div>
                                                          </div>
                                                      ):(
                                                        
                                                        <div key={index} className="col-md-3 col-sm-6">
                                                          <div  className="search-more-results rounded">
                                                              <div className="d-block">
                                                                <img src={i.image} alt="" style={{aspectRatio:'16/11',objectFit:'cover',width:'100%'}} className="img-fluid d-block rounded" />

                                                                  <div className="bg-overlay"></div>
                                                                  <div className="nav-icon">
                                                                      <i className="ri-image-fill align-middle me-1"></i> {s.searchResult?.inline_images?.length}+
                                                                  </div>
                                                              </div>
                                                          </div>
                                                        </div>
                                                      ))}
                                                      
                                                      
                                                      
                                                  </div>
                                                  
                                              </div>
                                              
                                          </div>
                                          
                                      </div>
                                      <div className="border border-dashed"></div>
                                    </div>
                                  )}
                                  {s.searchResult?.organic_results?.map((i,id)=>(
                                    <div key={id}>                                
                                      <div className="py-3">
                                          <h5 className="mb-1"><a href={i.link}>{i.title}</a></h5>
                                          <p className="text-success mb-2">{i.displayed_link}</p>
                                          <p className="text-muted mb-2">{i.snippet}</p>
                                      </div>
                                      {s.searchResult?.organic_results?.length-1 != id ? (<div className="border border-dashed"></div>):"" }
                                    </div>
                                  ))}
                              </div>
                              <div className="tab-pane" id="images" role="tabpanel" aria-labelledby="#images-tab">
                                  
                                  <div className="gallery-light">
                                      <div className="row">
                                        {s.searchResult?.inline_images?.map((i,index)=>
                                          (<div className="col-xl-3 col-lg-4 col-sm-6">
                                            <div className="gallery-box card">
                                                <div className="gallery-container">
                                                      <ImageViewer className="image-popup" image={i.image}>
                                                        <img className="gallery-img img-fluid mx-auto" style={{aspectRatio:"16/9",width:"100%",objectFit:'cover'}} src={i.image} alt="" />
                                                        <div className="gallery-overlay">
                                                            <h5 className="overlay-caption"></h5>
                                                        </div>
                                                      </ImageViewer>
                                                </div>
                                            </div>
                                          </div>)
                                        )}
                                          
                                      </div>
                                  </div>
                              </div>                          
                          </div>
                      </Card.Body>
                    </>
                  ):(<Card.Body><h2 className='text-center mb-5'>Search something ...</h2></Card.Body>)}
              </Card>
          </Col>
      </Row>
    </>
  );
}

export default Home;
