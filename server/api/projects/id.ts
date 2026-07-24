// server/api/projects/id.ts
export default eventHandler(async (event) => {
  // Query koleksi 'id_project' yang sudah Anda definisikan di content.config.ts
  const projects = await queryCollection(event, 'id_project').all()

  // Mengembalikan data JSON ke aplikasi Flutter
  return {
    success: true,
    data: projects,
  }
})
