from rest_framework import serializers

class FaceVerificationSerializer(serializers.Serializer):
    live_photo = serializers.CharField()  # Base64 image
    agent_id = serializers.IntegerField()
    problem_type = serializers.ChoiceField(choices=[
        ('matière', 'Matière'),
        ('technique', 'Technique'),
        ('câblage', 'Câblage')
    ])
    machine_id = serializers.IntegerField()