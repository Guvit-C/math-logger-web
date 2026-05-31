import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the log to know which images to delete
    const { data: log, error: fetchError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError || !log) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);
      
    if (deleteError) {
      throw deleteError;
    }

    // Delete images from storage
    if (log.image_urls && log.image_urls.length > 0) {
      const filenames = log.image_urls.map((url: string) => {
        // extract filename from public URL
        const parts = url.split('/');
        return parts[parts.length - 1];
      });
      
      await supabase.storage.from('question-images').remove(filenames);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting log:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
