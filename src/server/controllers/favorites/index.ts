import * as create from './create'
import * as removeById from './deleteById'
import * as getAllFavoritesUser from './getAllFavoritesByUser'
import * as validationFavorite from './validationFavorite'

export const FavoritesControl = {
    ...create,
    ...removeById,
    ...getAllFavoritesUser,
    ...validationFavorite,
}