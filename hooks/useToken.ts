import useSWR from 'swr';
import fetcher from '../utils/fetcher';

export default function useToken() {
  /*
   http POST http://localhost:8000/oauth/v2/token \
    grant_type=password \
    client_id=1_3o53gl30vhgk0c8ks4cocww08o84448osgo40wgw4gwkoo8skc \
    client_secret=636ocbqo978ckw0gsw4gcwwocg8044sco0w8w84cws48ggogs4 \
    username=wallabag \
    password=wallabag
    */
  const { data, error } = useSWR(``, fetcher);
}
