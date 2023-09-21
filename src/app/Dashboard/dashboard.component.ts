import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
  })


  export class DashboardComponent implements OnInit{
    
    LIST_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=263e31d1ad0c4defa8822787e614e716'
    IMAGE_URL = 'https://image.tmdb.org/t/p/w500/';
    SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=263e31d1ad0c4defa8822787e614e716&language=en-US&page=1&include_adult=true'
    moviesList: any;
    searchText: any = '';
    page = 1;
    timer: any;
    
    constructor(
        private http: HttpClient
    ){
    }
    ngOnInit(): void {
        this.getMoviesList();
    }

    getMoviesList(){
        this.http.get(this.LIST_URL + '&page=1').subscribe((res: any)=>{
            this.moviesList = res['results'];
            console.log(this.moviesList);
            this.appendThumbnailUrl();
        });
        
    }
    appendThumbnailUrl(){
        this.moviesList?.forEach((movie: any) => {
            movie.thumnailImg = this.IMAGE_URL + movie.poster_path;
        });
    }

    searched(event: any){ //used debounce logic here to reduce number of calls
    if(this.timer){
        clearTimeout(this.timer);
    }
    this.timer = setTimeout(()=>{
        this.searchMovies(event.target.value);
        this.timer = undefined;
    },1000)
    }


    searchMovies(query: string){
        let endpoint = '';
        if(query==''){
            endpoint = this.LIST_URL;
        }else{
            endpoint = this.SEARCH_API+'&query='+query;
        }
        this.http.get(endpoint).subscribe((res: any)=>{
            this.moviesList = res.results;
            this.appendThumbnailUrl();
        })
    }

    // searchMovies(){
    //     this.http.get(this.SEARCH_API+'&query='+this.searchText).subscribe((res: any)=>{
    //         this.moviesList = res.results;
    //         this.appendThumbnailUrl();
    //     })
    // }
    paginate(page: number){
        this.page = page;
        this.http.get(this.LIST_URL + '&page=' + page).subscribe((res:any)=>{
            this.moviesList = res.results;
            this.appendThumbnailUrl();
        })
    }
  }