
import axios from "axios";
import { useEffect, useState } from "react"
import { CustomAutoComplete } from "./customautocomplete";


export function FakeStore()
{

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([{id:0, title:'', price:0, description:'', image:'', rating:{rate:0, count:0}}]);
    const [cartCount, setCartCount] = useState();
    const [cartItems,setCartItems] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);
    


    function LoadCategories(){
        axios.get(`https://fakestoreapi.com/products/categories`)
        .then(response=>{
            response.data.unshift('all');
            setCategories(response.data);
        })
    }

    function LoadProducts(url){
        axios.get(url)
        .then(response=>{
            setProducts(response.data);
        })
    }
    
    function handleAddToCartClick(id){
        axios.get(`https://fakestoreapi.com/products/${id}`)
        .then(response =>{
            setCartItems(prevItems => [...prevItems, response.data]);
            setAlertMessage(`${response.data.title} \n Added to Cart`);
            setTimeout(() => {
                setAlertMessage(null);
              }, 2000);
        });
    }
    function handleCategoryChange(e){
        if(e.target.value==="all"){
            LoadProducts('https://fakestoreapi.com/products')
        } else {
            LoadProducts(`https://fakestoreapi.com/products/category/${e.target.value}`)

        }
    }


    function handleRatingChange(e){
        axios.get("https://fakestoreapi.com/products")
        .then(response =>{
            const filteredProducts= response.data.filter(product => product.rating.rate>= e.target.value);
            console.log(filteredProducts);
            setProducts(filteredProducts);
            
        })

    }
    function handleSearchClickCustom(searchStr) {
        // For "all", load all products; otherwise, load by category
        if (searchStr.toLowerCase() === "all") {
          LoadProducts("https://fakestoreapi.com/products");
        } else {
          LoadProducts(`https://fakestoreapi.com/products/category/${searchStr}`);
        }
      }

    useEffect(()=>{
        LoadCategories();
        LoadProducts(`https://fakestoreapi.com/products`);
        
        
    }, []);
    useEffect(() => {
        setCartCount(cartItems.length);
    }, [cartItems]);

    return(
        <div className="container-fluid">

        {alertMessage && (
            <div
                style={{
                        position: "fixed",
                        top: "60px",
                        left: "40%",
                        width: "300px",
                        zIndex: 1000, // Ensure it's above other elements
        }}
  >
            <div className="alert alert-primary" role="alert">
                {alertMessage}
            </div>
            </div>
)}
            <header className="d-flex bg-dark text-light fs-5 justify-content-between p-2 border mt-2">
                <div>
                    <span className="fs-4">Fakestore</span>
                </div>
                
                <nav className="p-2 fs-6">
                    <span> Electronics </span>
                    <span className="mx-2"> Men's Clothing </span>
                    <span> Women Fashon </span>
                    <span className="ms-2"> Jewelery </span>
                </nav>
                <div>
                <CustomAutoComplete categories={categories} onSearch={handleSearchClickCustom} />
                </div>
                <div>
                    <button className="btn btn-light"><span className="bi bi-person"></span></button>
                    <button className="btn btn-light mx-2"><span className="bi bi-heart"></span></button>
                    <button className="btn btn-light bi bi-cart position-relative" data-bs-toggle="modal" data-bs-target="#cart" ><span className="badge bg-danger rounded rounded-circle">{cartCount}</span></button>
                    <div className="modal fade" id="cart">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3 className="fw-bold text-center text-black">Your Cart Items</h3>
                                    <button className="btn btn-close" data-bs-dismiss= "modal"></button>
                                </div>
                                <div className="modal-body">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Preview</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                cartItems.map(item=> 
                                                    <tr key={item.id}>
                                                        <td>{item.title}</td>
                                                        <td><img alt={item.title} src={item.image} width="50" height="50" /></td>
                                                        <td>{item.price}</td>
                                                    </tr>
                                                )

                                            }
                                        </tbody>

                                    </table>

                                </div>
                                <div className="modal-footer">

                                </div>
                                 
                            </div>

                        </div>

                    </div>
                </div>
            </header>
            <section className="mt-3 row">
                <nav className="col-2">
                    <div>
                        <label className="form-label fw-bold">Select Category</label>
                        <div>
                            <select onChange={handleCategoryChange} className="form-select">
                                {
                                    categories.map(category=><option value={category} key={category}>{category.toUpperCase()}</option>)
                                }
                            </select>
                        </div>
                        <div className="my-3">
                            <label >Ratings</label>
                            <div>
                                <div>
                                    <input onChange={handleRatingChange} type="checkbox" value={4} /><span> 4 <span className="bi bi-star-fill"> Above</span></span>
                                </div>
                                <div>
                                    <input onChange={handleRatingChange} type="checkbox" value={3} /><span> 3 <span className="bi bi-star-fill"> Above</span></span>

                                </div>
                            </div>

                        </div>
                    </div>
                </nav>
                <main className="col-10 d-flex flex-wrap overflow-auto" style={{height:'500px'}}>
                    {
                        products.map(product=>

                            <div key={product.id} className="card p-2 m-2" style={{width:'200px'}}>
                                <img alt="product-image" className="card-img-top" height="120" src={product.image} />
                                <div className="card-header" style={{height:'100px'}}>
                                    {product.title}
                                </div>
                                <div className="card-body">
                                    <dl>
                                        <dt>Price</dt>
                                        <dd>{product.price}</dd>
                                        <dt>Rating</dt>
                                        <dd> {product.rating.rate} <span className="bi bi-star-fill text-success"></span> </dd>
                                    </dl>
                                </div>
                                <div className="card-footer">
                                    <button onClick={()=> handleAddToCartClick(product.id)} className="btn btn-warning w-100"> <span className="bi bi-cart4"> Add to Cart </span> </button>
                                </div>
                            </div>

                        )
                    }
                </main>
            </section>
        </div>
    )
}