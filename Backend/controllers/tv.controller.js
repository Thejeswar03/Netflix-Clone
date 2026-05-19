import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function getTrendingTv(req, res) {
  try {
    const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/tv/day?language=en-US");
    const randomTv = data.results[Math.floor(Math.random() * data.results?.length)];//? indicates if its null we dont get any result.

    res.json({Success:true, content: randomTv});
  } catch (error) {
    res.status(500).json({ Success:false, Message:"Internal Server Error" });
  }
};

export async function getTvTrailers(req, res) {
  const {id} = req.params;
  try {
    
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`);
    res.json({Success: true, Tv: data.results})
  } catch (error) {
    if(error.message.includes("404")){
      return res.status(404).send(null);
    } 

    res.status(500).json({Success:false, message:"Internal server error"});
  }
};

export async function getTvDetails(req, res) {
  const {id} = req.params;
  try {
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);
    res.json({success: true, content: data});
  } catch (error) {
    if(error.message.includes("404")){
      return res.status(404).send(null);
    }
  
    res.status(500).json({Success:false, message:"Internal server error"});
  }
};

export async function getSimilarTv(req, res) {
  const {id} = req.params;
  try {
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`);
    res.json({success: true, content: data});
  } catch (error) {
    if(error.message.includes("404")){
      return res.status(404).send(null);
    }
    res.status(500).json({Success:false, message:"Internal server error"});
  };
}

export async function getTvByCategory(req, res) {
  const {category} = req.params;//now_playing, upcoming, top_rated, popular are the categories
  try {
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`);
    res.json({success: true, content: data.results});
  } catch (error) {
    if(error.message.includes("404")){
      return res.status(404).send(null);
    }
  }
};